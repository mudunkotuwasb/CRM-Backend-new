const mongoose = require("mongoose");
const Contact = require("../model/contact");
const User = require("../model/user");
const { addContactMSG,
  updateContactMSG,
  getContactsByEmailMSG,
  changeContactStatusMSG,
  getContactsByStatusMSG } = require('../utils/reponseMessages');

const { CONTACT_STATUS } = require('../utils/status'); 
const ScheduleContact = require('../model/ScheduleContact');

const addContact = async (req, res) => {
  try {

    const { name, company, position, email, phone, uploadedBy, uploadDate, assignedTo, status, lastContact } = req.body;
    console.log("Adding contact:", req.body);
    // Validate assignedTo if provided
    if (!uploadedBy)
      return res.status(404).json({ success: false, message: addContactMSG.isUploadedByEmpty })

    // Validate required fields
    if (!name || !company || !position || !email || !phone) {
      return res.status(400).json({ success: false, message: "All required fields must be provided" });
    }


    // Validate uploadedBy
    if (!uploadedBy) {
      return res.status(400).json({ success: false, message: addContactMSG.isUploadedByEmpty });
    }

    if (!mongoose.Types.ObjectId.isValid(uploadedBy)) {
      return res.status(400).json({ success: false, message: addContactMSG.isUploadedByValied });
    }

    const userExists = await User.findById(uploadedBy);
    if (!userExists) {
      return res.status(404).json({ success: false, message: addContactMSG.uploadedByNotExist });
    }

    //Create contact with proper field structure


    const contact = new Contact({ name, company, position, email, phone, uploadedBy, uploadDate, assignedTo, status, lastContact });

    await contact.save();
    return res.status(201).json({ success: true, message: addContactMSG.addContactSucccess, contact });

  } catch (err) {
    console.error("Add contact error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    await CheckIsDeleted(id);
    const { name, company, position, phone, email, uploadedBy, uploadDate, assignedTo, status, lastContact } = req.body;

    const oldRec = await Contact.findById(id);
    if (!oldRec) return res.status(404).json({ success: false, message: updateContactMSG.contactNotExist });

    const contact = await Contact.findByIdAndUpdate(
      id,
      { name, company, position, phone, email, uploadedBy, uploadDate, assignedTo, status, lastContact },
      { new: true }
    );
    return res.status(200).json({ success: true, message: updateContactMSG.updateContactSuccess, contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


const getAllContacts = async (req, res) => {
  try {
    //Extract pagination and filtering parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const filterType = req.query.filterType || "name";
    const dateFilter = req.query.dateFilter ? new Date(req.query.dateFilter) : null;
    
    //Build search query
    let searchQuery = { isDeleted: false };
    
    if (search) {
      if (filterType === "name") {
        searchQuery.name = { $regex: search, $options: "i" };
      } else if (filterType === "company") {
        searchQuery.company = { $regex: search, $options: "i" };
      } else if (filterType === "email") {
        searchQuery.email = { $regex: search, $options: "i" };
      }
    }
    
    //date filter if provided
    if (dateFilter) {
      const startOfDay = new Date(dateFilter);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateFilter);
      endOfDay.setHours(23, 59, 59, 999);
      
      searchQuery.uploadDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }
    
    //Get total count for pagination
    const totalContacts = await Contact.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalContacts / limit);
    
    //Fetch paginated contacts with population
    const contacts = await Contact.find(searchQuery)
      .populate("uploadedBy", "username")
      .sort({ uploadDate: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit);
    
    // Transform contacts to match frontend structure
    const allContacts = contacts.map(contact => ({
      _id: contact._id,
      name: contact.name,
      company: contact.company,
      position: contact.position,
      email: contact.email || 'No email',
      phone: contact.phone || 'No phone',
      uploadedBy: contact.uploadedBy?.username || 'Unknown',
      uploadDate: contact.uploadDate,
      assignedTo: contact.assignedTo || "Unassigned",
      status: contact.status || "UNASSIGNED",
      lastContact: contact.lastContact || new Date(0),
      isDeleted: contact.isDeleted || false,
      contactHistory: contact.contactHistory || [],
    }));
    
    //Return with pagination info
    return res.json({
      allContacts,
      pagination: {
        currentPage: page,
        totalPages,
        totalContacts,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (err) {
    console.error("Error getting contacts:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Change the function name and logic
const getContactsByAdminId = async (req, res) => {
  try {
    const { adminId, page = 1, limit = 10 } = req.body;

    // Validate adminId
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Query database with pagination
    const contacts = await Contact.find({ uploadedBy: adminId, isDeleted: false })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 }); // Sort by most recent

    // Get total count for pagination
    const total = await Contact.countDocuments({ uploadedBy: adminId, isDeleted: false });
    const totalPages = Math.ceil(total / limitNum);

    if (!contacts || contacts.length === 0) {
      return res.status(200).json({ 
        contacts: [], 
        total: 0, 
        totalPages: 0,
        message: "No contacts found for this admin" 
      });
    }

    res.status(200).json({ 
      contacts, 
      total, 
      totalPages,
      currentPage: pageNum 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

const getMyContacts = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found in token" });
    }

    // 🟢 Find contacts created by this user
    const contacts = await Contact.find({ uploadedBy: userId, isDeleted: false }).populate('uploadedBy', 'name');

    return res.status(200).json({ success: true, contacts });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const changeContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    await CheckIsDeleted(id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: changeContactStatusMSG.isStatusEmpty });

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: changeContactStatusMSG.contactNotExist });
    return res.status(200).json({ success: true, message: changeContactStatusMSG.updateStatusSuccess, contact });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getContactsByStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: getContactsByStatusMSG.isStatusEmpty });

    const contacts = await Contact.find({ status, isDeleted: false });
    if (!contacts || contacts.length === 0) return res.status(404).json({ success: false, message: getContactsByEmailMSG.isNotContactMatch });

    return res.status(200).json({ success: true, contacts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const CheckIsDeleted = async (id) => {
  const contact = await Contact.findById(id);
  if (contact && contact.isDeleted === true) {
    throw new Error("This contact was deleted");
  }
};




const updateContactStatus = async (req, res) => {
  try {
    console.log("Update status request body:", req.body);
    
    const { contactId, status } = req.body;
    
    // Validate input
    if (!contactId || !status) {
      console.log("Missing contactId or status");
      return res.status(400).json({ 
        success: false, 
        message: "Contact ID and status are required" 
      });
    }
    
    // Validate status value
    if (!Object.values(CONTACT_STATUS).includes(status)) {
      console.log("Invalid status value:", status);
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }
    
    console.log("Updating contact:", contactId, "to status:", status);
    
    // Find and update the contact
    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { 
        status,
        lastContact: new Date() // Update last contact date
      },
      { new: true } // Return the updated document
    );
    
    if (!contact) {
      console.log("Contact not found:", contactId);
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }
    
    console.log("Contact updated successfully:", contact);
    
    return res.status(200).json({ 
      success: true, 
      message: "Contact status updated successfully",
      contact 
    });
    
  } catch (err) {
    console.error("Update contact status error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};


const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to HARD DELETE contact with ID: ${id}`);
    
    // Validate contact ID
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Contact ID is required" 
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }

    await Contact.findByIdAndDelete(id);

    console.log(`Contact ${id} permanently deleted from database`);
    
    res.status(200).json({ 
      success: true, 
      message: "Contact permanently deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};




const addNoteToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes, outcome, nextAction, scheduledDate } = req.body;

    // Validate required fields
    if (!notes || !outcome) {
      return res.status(400).json({ 
        success: false, 
        message: 'Notes and outcome are required fields' 
      });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    // Validate and fix contact status if invalid
    const validStatusValues = Object.values(CONTACT_STATUS);
    if (!validStatusValues.includes(contact.status)) {
      console.warn(`Invalid status ${contact.status} found, resetting to UNASSIGNED`);
      contact.status = CONTACT_STATUS.UNASSIGNED;
      await contact.save();
    }

    // Create new note
    const newNote = {
      id: contact.contactHistory ? contact.contactHistory.length + 1 : 1,
      date: new Date(),
      notes: notes.trim(),
      outcome: outcome.trim(),
      nextAction: nextAction ? nextAction.trim() : undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined
    };

    // Update contact Notes array and last contact date
    contact.contactHistory = contact.contactHistory || [];
    contact.contactHistory.push(newNote);
    contact.lastContact = new Date();

    await contact.save();

    res.json({ 
      success: true, 
      message: 'Note added successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add note',
      error: error.message 
    });
  }
};



const deleteContactHistory = async (req, res) => {
  try {
    const { contactId, historyId } = req.params;
    
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact ID"
      });
    }

    const parsedHistoryId = parseInt(historyId);
    if (isNaN(parsedHistoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid history ID"
      });
    }

    // Find the contact
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }

    // Find the history item index
    const historyIndex = contact.contactHistory.findIndex(
      history => history.id === parsedHistoryId
    );

    if (historyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Contact history not found"
      });
    }

    // Remove the history item
    contact.contactHistory.splice(historyIndex, 1);

    // FIX: Ensure status is valid before saving
    if (!Object.values(CONTACT_STATUS).includes(contact.status)) {
      // Reset to default status if current status is invalid
      contact.status = CONTACT_STATUS.UNASSIGNED;
    }

    // Save the updated contact
    await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact history deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting contact history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};



const scheduleCalls = async (req, res) => {
  try {
    const { contactIds, scheduledDate, notes } = req.body;
    const adminId = req.user.id;

    // Validate input
    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one contact'
      });
    }

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a scheduled date'
      });
    }

    // Check if contacts exist and belong to the admin
    const contacts = await Contact.find({
      _id: { $in: contactIds },
      $or: [
        { assignedTo: adminId },
        { uploadedBy: adminId }
      ]
    });

    if (contacts.length !== contactIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some contacts were not found or you do not have permission to schedule calls for them'
      });
    }

    // Create scheduled calls
    const scheduledCalls = contactIds.map(contactId => ({
      contactId,
      adminId,
      scheduledDate: new Date(scheduledDate),
      notes: notes || ''
    }));

    const result = await ScheduleContact.insertMany(scheduledCalls);

    // Update last contact date for each contact
    await Contact.updateMany(
      { _id: { $in: contactIds } },
      { lastContact: new Date() }
    );

    res.status(201).json({
      success: true,
      message: `Scheduled ${result.length} calls successfully`,
      data: result
    });

  } catch (error) {
    console.error('Error scheduling calls:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


const getScheduledCalls = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { status, timeframe } = req.query;

    let query = { adminId };

    // Add status filter if provided
    if (status && ['scheduled', 'completed', 'cancelled', 'missed'].includes(status)) {
      query.status = status;
    }

    // Add date filter if timeframe is provided
    if (timeframe === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      query.scheduledDate = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    } else if (timeframe === 'upcoming') {
      query.scheduledDate = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const scheduledCalls = await ScheduleContact.find(query)
      .populate('contactId', 'name company phone email position')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: scheduledCalls
    });

  } catch (error) {
    console.error('Error fetching scheduled calls:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


const deleteScheduledCall = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    // Find the scheduled call and verify it belongs to the admin
    const scheduledCall = await ScheduleContact.findOne({
      _id: id,
      adminId: adminId
    });

    if (!scheduledCall) {
      return res.status(404).json({
        success: false,
        message: 'Scheduled call not found or you do not have permission to delete it'
      });
    }

    // Delete the scheduled call
    await ScheduleContact.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Scheduled call deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting scheduled call:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};



module.exports = {
  addContact,
  updateContact,
  getAllContacts,
  getContactsByAdminId,
  getMyContacts,
  changeContactStatus,
  getContactsByStatus,
  updateContactStatus,
  deleteContact,
  addNoteToContact,
  deleteContactHistory,
  scheduleCalls,
  getScheduledCalls,
  deleteScheduledCall
};