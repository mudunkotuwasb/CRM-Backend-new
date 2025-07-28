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

    if (!mongoose.Types.ObjectId.isValid(uploadedBy))
      return res.status(400).json({ success: false, message: addContactMSG.isUploadedByValied })

    const userExists = await User.findById(uploadedBy);
    if (!userExists) return res.status(404).json({ success: false, message: addContactMSG.uploadedByNotExist })

    const contact = new Contact({ name, company, position, email, phone, uploadedBy, uploadDate, assignedTo, status, lastContact });
    await contact.save();
    return res.status(201).json({ success: true, message: addContactMSG.addContactSucccess, contact });

  } catch (err) {
    console.error("Add contact error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    await CheckIsDeleted(id);
    const { name, company, position, contactInfo, uploadedBy, uploadDate, assignedTo, status, lastContact } = req.body;

    const oldRec = await Contact.findById(id);
    if (!oldRec) return res.status(404).json({ success: false, message: updateContactMSG.contactNotExist });

    const contact = await Contact.findByIdAndUpdate(
      id,
      { name, company, position, contactInfo, uploadedBy, uploadDate, assignedTo, status, lastContact },
      { new: true }
    );
    return res.status(200).json({ success: true, message: updateContactMSG.updateContactSuccess, contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllContacts = async (_req, res) => {
  try {
    const allContacts = await Contact.find({ isDeleted: false });
    return res.json({ allContacts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getContactsByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: getContactsByEmailMSG.isEmailEmpty });

    const contact = await Contact.findOne({ email, isDeleted: false });
    if (!contact) return res.status(404).json({ success: false, message: getContactsByEmailMSG.contactNotExist });

    return res.status(200).json({ success: true, contact });

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
  getContactsByEmail,
  changeContactStatus,
  getContactsByStatus
};