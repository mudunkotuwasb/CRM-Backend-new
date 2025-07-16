const router = require("express").Router();
const authRoute = require("./auth");
const adminRoute = require("./admin");
const { checkRole, userAuth } = require("../controller/auth");
const ROLES = require("../utils/roles");
const companyRepresentativeRoute = require('./companyRepresentative');
const dataControllerRoute = require('./dataController');

// Anyone can access this route
router.get("/", (req, res) => {
  res.send("Api running...");
});
// Authentication Router Middleware
router.use("/auth", authRoute);

// Admin Protected Route
router.use("/admin", userAuth, checkRole([ROLES.admin]), adminRoute);

// Add business protected route
router.use("/company-representative", userAuth, checkRole([ROLES.admin, ROLES.company_representative]), companyRepresentativeRoute);

// Add data controller protected route
router.use("/dataController", userAuth, dataControllerRoute);

module.exports = router;