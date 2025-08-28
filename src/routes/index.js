const router = require("express").Router();
const authRoute = require("./auth");
const adminRoute = require("./admin");
const { checkRole, userAuth } = require("../controller/auth");
const ROLES = require("../utils/roles");
const contactRouter = require('./contact');
const dataControllerRoute = require('./dataController');

// Anyone can access this route
router.get("/", (req, res) => {
  res.json({
    message: "API running",
    status: "OK",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      contacts: "/api/contact-manager",
      data: "/api/dataController"
    }
  });
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