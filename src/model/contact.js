const mongoose = require("mongoose");
const CONTACT_STATUS = require('../utils/status');

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  roleTitle: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, required: true, default: CONTACT_STATUS.ACTIVE, enum: [CONTACT_STATUS.ACTIVE, CONTACT_STATUS.PROSPECT, CONTACT_STATUS.LEAD] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  addedDate: { type: Date, default: Date.now },
  firstContact: { type: Date, default: Date.now },
  totalContact: { type: Number, default: 0 },
  nextContact: { type: String, default: "Not scheduled" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model("Contact", contactSchema);

