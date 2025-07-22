const mongoose = require("mongoose");
const CONTACT_STATUS = require('../utils/status');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  company: { type: String, required: true },
  position: { type: String, required: true },
  contactInfo: { // Change
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadDate: { type: Date, required: true }, // Change
  assignedTo: { type: String, default: "Unassigned" },
  status: { type: String, default: CONTACT_STATUS.UNASSIGNED, enum: [CONTACT_STATUS.ASSIGNED, CONTACT_STATUS.UNASSIGNED] },
  lastContact: { type: Date, default: new Date(0) }, // Change:
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);