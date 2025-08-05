const mongoose = require('mongoose');
const ROLES = require('../utils/roles');
const STATUS = require('../utils/status');


const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: "COMPANY_REPRESENTATIVE", enum: [ROLES.admin.value, ROLES.marketing_staff.value, ROLES.management.value, ROLES.company_representative.value] },
    status: {type: String, required: true, default: "ACTIVE", enum: [STATUS.ACTIVE, STATUS.INACTIVE, STATUS.BLOCKED, STATUS.DELETED]},
    password: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now },
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
