const jwt = require("jsonwebtoken");
const { adminAuthMSG } = require("../utils/reponseMessages");

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: adminAuthMSG.isValidAuthHeader });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id, username, role
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: adminAuthMSG.isInvalidToken });
  }
};

// middleware/checkRole.js
const checkAdminRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) 
      return res.status(403).json({ success: false, message: err.message});
    next();
  };
};


module.exports = { adminAuth, checkAdminRole };