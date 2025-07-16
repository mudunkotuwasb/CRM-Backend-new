const mongoose = require("mongoose");
const Contact = require("../model/contact");
const User = require("../model/user");

const newRequest = async (req, res) => {
    try {
        const { type, to, priority, contacts, message } = req.body;

        // Validate to id
        if (!mongoose.Types.ObjectId.isValid(to)) 
            return res.status(400).json({success: false, message: "Invalid Business ID for company field"});

        const userExists = await User.findById(to);
        if (!userExists) return res.status(404).json({success: false, message: "Business not found"});
        
        const request = new Request({
            form, to, type, contacts, priority, status, message, create: Date.now(), date: Date.now(),
            createdBy: req.user._id,
        });
        await request.save();

        return res.status(201).json({ success: true, message: "Request added successfully", request });
    } catch (err) {
        console.error("Add new request error:", err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { newRequest };