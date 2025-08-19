const mongoose = require("mongoose");
const Contact = require("../model/contact");
const User = require("../model/user");
const { addContactMSG,
  updateContactMSG,
  getContactsByEmailMSG,
  changeContactStatusMSG,
  getContactsByStatusMSG } = require('../utils/reponseMessages');

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
    const contacts = await Contact.find({ isDeleted: false })
      .populate("uploadedBy", "username");

    const allContacts = contacts.map(contact => ({
      _id: contact._id,
      name: contact.name,
      company: contact.company,
      position: contact.position,
      email: contact.email || 'No email',
      phone: contact.phone || 'No phone',
      uploadedBy: contact.uploadedBy?.username || 'Unknown', // Flattened
      uploadDate: contact.uploadDate,
      assignedTo: contact.assignedTo || "Unassigned",
      status: contact.status || "UNASSIGNED",
      lastContact: contact.lastContact || new Date(0),
      isDeleted: contact.isDeleted || false,
    }));

    return res.json({ allContacts });
  } catch (err) {
    console.error("Error getting contacts:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Change the function name and logic
const getContactsByAdminId = async (req, res) => {
  try {
    const { adminId } = req.body;

    // Validate adminId (instead of email validation)
    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Query database by adminId (instead of email)
    const contacts = await Contact.find({ uploadedBy: adminId }); // Adjust field name as needed

    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "No contacts found for this admin" });
    }

    res.status(200).json({ contacts });
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

module.exports = {
  addContact,
  updateContact,
  getAllContacts,
    getContactsByAdminId,
  getMyContacts,
  changeContactStatus,
  getContactsByStatus
};