const Contact = require("../model/contact");
const mongoose = require("mongoose");

const deleteTemporarily = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: 'Invalid ID format' });

    try {
        const contact = await Contact.findById(id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });

        if (contact.isDeleted === true)
            return res.status(400).json({ message: "Contact is already marked as deleted" });

        contact.isDeleted = true;
        await contact.save();

        return res.status(200).json({ message: "Contact deleted temporarily" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const restoreRecord = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
        const contact = await Contact.findById(id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        if (!contact.isDeleted) return res.status(400).json({ message: "Contact is not deleted" });
        contact.isDeleted = false;
        await contact.save();
        return res.status(200).json({ message: "Contact restored successfully" });
    } catch (error) {
        console.error("Error restoring contact:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const deletePermanently = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ message: 'Invalid ID format' });
    
    try {
        const contact = await Contact.findById(id);

        if (!contact) return res.status(404).json({ message: "Contact not found" });
        if (!contact.isDeleted) 
            return res.status(400).json({ message: "Contact is not marked as deleted. Cannot permanently delete." });
        
        await Contact.findByIdAndDelete(id);
        return res.status(200).json({ message: "Contact permanently deleted" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
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
