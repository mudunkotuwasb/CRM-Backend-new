const router = require("express").Router();
const authRoute = require("./auth");
const adminRoute = require("./admin");
const { checkRole, userAuth } = require("../controller/auth");
const ROLES = require("../utils/roles");
const contactRouter = require('./contact');
const dataControllerRoute = require('./dataController');

// Anyone can access this route
router.get("/", (req, res) => {
  res.send("Api running...");
});
// Authentication Router Middleware
router.use("/auth", authRoute);

// Admin Protected Route
router.use("/admin", userAuth, checkRole([ROLES.admin]), adminRoute);

// Admin and Company Representative protected Route
router.use("/contact-manager", userAuth, checkRole([ROLES.admin, ROLES.company_representative]), contactRouter);

// Add data controller protected route
router.use("/dataController", userAuth, dataControllerRoute);

module.exports = router;