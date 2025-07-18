const Contact = require("../model/contact");
const mongoose = require("mongoose");
const { deleteTemporarilyMSG, restoreRecordMSG, deletePermanentlyMSG, deleteAllMSG } = require("../utils/reponseMessages");

const deleteTemporarily = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ message: deleteTemporarilyMSG.isNotValidId });

    try {
        const contact = await Contact.findById(id);
        if (!contact) return res.status(404).json({ message: deleteTemporarilyMSG.contactNotExist });

        if (contact.isDeleted === true)
            return res.status(400).json({ message: deleteTemporarilyMSG.isIsDeletedTrue });

        contact.isDeleted = true;
        await contact.save();

        return res.status(200).json({ message: deleteTemporarilyMSG.isDeletedTrueSuccess });
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
};


const restoreRecord = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ message: restoreRecordMSG.isNotValidId });
    
    try {
        const contact = await Contact.findById(id);
        if (!contact) return res.status(404).json({ message: restoreRecordMSG.contactNotExist });
        if (!contact.isDeleted) return res.status(400).json({ message: restoreRecordMSG.isIsDeletedTrue });
        contact.isDeleted = false;
        await contact.save();
        return res.status(200).json({ message: restoreRecordMSG.isDeletedFalseSuccess });
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
};


const deletePermanently = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) 
        return res.status(400).json({ message: deletePermanentlyMSG.isNotValidId });
    
    try {
        const contact = await Contact.findById(id);

        if (!contact) return res.status(404).json({ message: deletePermanentlyMSG.contactNotExist });
        if (!contact.isDeleted) 
            return res.status(400).json({ message: deletePermanentlyMSG.isNotIsDeletedTrue });
        
        await Contact.findByIdAndDelete(id);
        return res.status(200).json({ message: deletePermanentlyMSG.deletePermanentlySuccess });
    } catch (error) {
        return res.status(500).json({ message: err.message });
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

        return res.status(200).json({ message: deleteAllMSG.deleteAllSuccess});
    } catch (error) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    deleteTemporarily,
    restoreRecord,
    deletePermanently,
    deleteAll
};
