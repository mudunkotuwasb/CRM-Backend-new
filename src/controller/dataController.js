const Business = require("../model/business");
const Contact = require("../model/contact");
const mongoose = require("mongoose");

const deleteTemporarily = async (req, res) => {
    const { type, id } = req.body;
    const allowedTypes = ['business', 'contact'];
    if (!allowedTypes.includes(type)) return res.status(400).json({ message: "Invalid type" });
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
        if (type === "business") {
            const business = await Business.findByIdAndUpdate(id, { isDeleted: true });
            if (!business) return res.status(404).json({ message: "Business not found" });  
        } else if (type === "contact") {
            const contact = await Contact.findByIdAndUpdate(id, { isDeleted: true });
            if (!contact) return res.status(404).json({ message: "Contact not found" });  
        } else {
            return res.status(400).json({ message: "Something went wrong" });
        }

        return res.status(200).json({ message: "Data deleted temporarily" });
    } catch (error) {
        console.error("Error deleting business:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const restoreRecord = async (req, res) => {
    const { type, id } = req.body;
    const allowedTypes = ['business', 'contact'];
    if (!allowedTypes.includes(type)) return res.status(400).json({ message: "Invalid type" });
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
        if (type === "business") {
            const business = await Business.findByIdAndUpdate(id, { isDeleted: false });
            if (!business) return res.status(404).json({ message: "Business not found" });
            
        } else if (type === "contact") {
            const contact = await Contact.findByIdAndUpdate(id, { isDeleted: false });
            if (!contact) return res.status(404).json({ message: "Contact not found" });
        } else {
            return res.status(400).json({ message: "Something went wrong" });
        }

        return res.status(200).json({ message: "Data restored successfully" });
    } catch (error) {
        console.error("Error restoring data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deletePermanently = async (req, res) => {
    const { type, id } = req.body;
    const allowedTypes = ['business', 'contact'];
    if (!allowedTypes.includes(type)) return res.status(400).json({ message: "Invalid type" });
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });
    
    try{
        if (type === "business") {
            const business = await Business.findByIdAndDelete({ _id: id });
            if (!business) return res.status(404).json({ message: "Business not found" });  
        } else if (type === "contact") {
            const contact = await Contact.findByIdAndDelete({ _id: id });
            if (!contact) return res.status(404).json({ message: "Contact not found" });
        } else {
            return res.status(400).json({ message: "Something went wrong" });
        }

        return res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAll = async (req, res) => {
  try {
    const modelNames = mongoose.modelNames();

    for (const name of modelNames) {
      const Model = mongoose.model(name);

      // Skip if model doesn't have an `isDeleted` field
      const schemaPaths = Model.schema.paths;
      if (!schemaPaths['isDeleted']) continue;

      // Delete all documents with isDeleted: true
      await Model.deleteMany({ isDeleted: true });
    }

    return res.status(200).json({
      message: 'All temporarily deleted records permanently removed.',
    });
  } catch (error) {
    console.error('Error in bulk delete:', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

module.exports = {
    deleteTemporarily,
    restoreRecord,
    deletePermanently,
    deleteAll
};
