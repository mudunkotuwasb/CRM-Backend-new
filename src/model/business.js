const mongoose = require("mongoose");
const BUSINESS_STATUS = require('../utils/status');

const businessSchema = new mongoose.Schema({
  businessName: { type: String, required: true },
  industry: { type: String, required: true },
  companySize: { type: String, required: true },
  location: { type:String, required: true },
  status: { type: String, required: true, default: BUSINESS_STATUS.ACTIVE, enum: [BUSINESS_STATUS.ACTIVE, BUSINESS_STATUS.PROSPECT, BUSINESS_STATUS.LEAD, BUSINESS_STATUS.CONVERTED] },
  website: { type: String },
  contact: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  last_interaction: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);
