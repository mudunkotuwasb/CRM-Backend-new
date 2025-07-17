const mongoose = require("mongoose");
const CONTACT_STATUS = require('../utils/status');

const contactSchema = new mongoose.Schema({
// TODO: missed title of the user (contact)
  Name: { type: String, required: true }, // TODO: don't use capital letters as the first character
  company: { type: mongoose.Schema.Types.ObjectId, required: true },
   contactInfo: {
    email: { type: String, required: true }, // TODO: use seperated fields for these, no need a json 
    phone: { type: String, required: true }
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDDate: { type: Date, required: true },
  assignedTo: { type: String, default: "Unassigned" },
  status: { type: String, default: CONTACT_STATUS.UNASSIGNED, enum: [CONTACT_STATUS.ASSIGNED, CONTACT_STATUS.UNASSIGNED] },
  lastContact: { type: Date, default: "Never" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);