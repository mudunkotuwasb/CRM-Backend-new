const Business = require("../model/business");
const Contact = require("../model/contact");

const addBusiness = async (req, res) => {
  try {
    const { businessName, industry, companySize, location, website, status } = req.body;

    const business = new Business({
      businessName, industry, companySize, location, website,
      status, last_interaction: Date.now(), createdBy: req.user._id
    });

    await business.save();
    return res.status(201).json({ success: true, business });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateBusiness = async (req, res) => {
  try {
    await CheckIsDeleted(req.params.id);
    const { businessName, industry, companySize, location, website, status } = req.body;

    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { businessName, industry, companySize, location, website, status, updatedBy: req.user._id },
      { new: true });

    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    return res.status(200).json({ success: true, message: "Business updated successfully", business });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllBusinesses = async (_req, res) => {
  try {
    const allBusinesses = await Business.find({ isDeleted: false });
    return res.json({ allBusinesses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

const getBusinessById = async (req, res) => {
  try {
    await CheckIsDeleted(req.params.id);
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ success: false, message: "Business not found" });

    return res.status(200).json({ success: true, business });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const searchBusinessesByName = async (req, res) => {
  const { businessName } = req.body;
  if (!businessName) return res.status(400).json({ message: "Business name query is required" });

  try {
    const businesses = await Business.find({ businessName: { $regex: businessName, $options: "i" }, isDeleted: false });
    if (businesses.length === 0) return res.status(404).json({ success: false, message: "No matching businesses found" });

    return res.status(200).json({ success: true, message: "Matching businesses retrieved successfully", businesses });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const changeBusinessStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status is required" });

  try {
    await CheckIsDeleted(req.params.id);
    const business = await Business.findByIdAndUpdate(
      req.params.id, { status, isDeleted: false }, { new: true });

    if (!business) return res.status(404).json({ message: "Business not found" });

    return res.status(200).json({ message: "Business status updated", business });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changeBusinessLastInteraction = async (req, res) => {
  try {
    await CheckIsDeleted(req.params.id);
    const business = await Business.findByIdAndUpdate(
      req.params.id, { last_interaction: Date.now() }, { new: true });

    if (!business) return res.status(404).json({ message: "Business not found" });
    
    return res.status(200).json({ message: "Business last interaction date updated", business });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getBusinessesByStatus = async (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status is required" });
  
  try {
const businesses = await Business.find({ status, isDeleted: false });
    if (businesses.length === 0) {
      return res.status(404).json({ message: "No businesses found with the specified status" });
    }
    return res.status(200).json({ message: "Businesses retrieved successfully", businesses });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateContactCount = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) throw new Error("Business not found");
  
    const contactCount = await Contact.countDocuments({ company: businessId, isDeleted: false });
    business.contact = contactCount;
    await business.save();
  } catch (err) {
    console.error("Update contact count error:", err);
  }
};

const CheckIsDeleted = async (id) => {
  const business = await Business.findById(id);
  if (business && business.isDeleted === true) {
    throw new Error("This business was deleted");
  }
};

module.exports = {
  addBusiness,
  updateBusiness,
  getAllBusinesses,
  getBusinessById,
  searchBusinessesByName,
  changeBusinessStatus,
  changeBusinessLastInteraction,
  getBusinessesByStatus,
  updateContactCount
};