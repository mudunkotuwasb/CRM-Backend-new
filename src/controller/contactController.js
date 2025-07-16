const mongoose = require("mongoose");
const Contact = require("../model/contact");
const User = require("../model/user");
const Business = require("../model/business");
const { updateContactCount } = require("./businessController");

const addContact = async (req, res) => {
  try {
    const { fullName, roleTitle, company, email, phone, department, status, assignedTo } = req.body;

    // Validate Business ID
    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json({ success: false, message: "Invalid Business ID for company field" })
    };

    const businessExists = await Business.findById(company);
    if (!businessExists) {
      return res.status(404).json({ success: false, message: "Business not found" })
    };

    // Validate assignedTo if provided
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({ success: false, message: "Invalid User ID for assignedTo field" })
      };

      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(404).json({ success: false, message: "Assigned user not found" })
      };
    }
    const contact = new Contact({
      fullName, roleTitle, company, email, phone, department, status, addedDate: Date.now(),
      firstContact: Date.now(), totalContact: 0, nextContact: "Not scheduled", assignedTo, createdBy: req.user._id
    });
    await contact.save();

    // Update contact count for the associated business
    await updateContactCount(company);

    return res.status(201).json({ success: true, message: "Contact added successfully", contact });
  } catch (err) {
    console.error("Add contact error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    await CheckIsDeleted(req.params.id);
    const { fullName, roleTitle, company, email, phone, department, status, assignedTo } = req.body;

    const oldRec = await Contact.findById(req.params.id);
    if (!oldRec) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { fullName, roleTitle, company, email, phone, department, status, assignedTo, updatedBy: req.user._id },
      { new: true }
    );

    if (oldRec.company !== company) {
      await updateContactCount(oldRec.company);
    }
    await updateContactCount(company);
    return res.status(200).json({ success: true, message: "Contact updated successfully", contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllContacts = async (_req, res) => {
  try {
    const allContacts = await Contact.find({ isDeleted: false });
    return res.json({ allContacts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getContactsByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const contact = await Contact.findOne({ email, isDeleted: false });

    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    return res.status(200).json({ success: true, contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

const changeContactStatus = async (req, res) => {
  try {
    await CheckIsDeleted(req.params.id);
    const { status } = req.body;

    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    return res.status(200).json({success: true, message: "Contact status updated successfully", contact});
  } catch (err) {
    return res.status(500).json({success: false, message: "Internal Server Error", error: err.message});
  }
};

const getContactsByStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) return res.status(400).json({success: false, message: "Status is required"});

    const contacts = await Contact.find({ status, isDeleted: false });

    if (contacts.length === 0) return res.status(404).json({success: false, message: "No contacts found with the specified status"});
    
    return res.status(200).json({success: true, contacts});
  } catch (err) {
    return res.status(500).json({success: false, message: "Internal Server Error", error: err.message});
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
  getContactsByEmail,
  changeContactStatus,
  getContactsByStatus
};