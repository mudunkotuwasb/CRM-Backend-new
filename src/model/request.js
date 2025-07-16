const mongoose = require("mongoose");
const REQUEST_STATUS = require('../utils/status');
const contact = require("./contact");

const requestSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
    priority: { type: String, required: true, enum: ['Low', 'Medium', 'High'] },
    message: { type: String, required: true },
    status: { type: String, required: true, default: REQUEST_STATUS.PENDING, enum: [REQUEST_STATUS.PENDING, REQUEST_STATUS.APPROVED, REQUEST_STATUS.PENDING_APPROVAL] },
    create: { type: Date, default: Date.now },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;