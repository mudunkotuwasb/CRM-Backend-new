// importing necessary modules
const passport = require("passport");
const register = require("./register");
const login = require("./login");

// user registration and login functions
const userRegister = (userRequest, res) => register(userRequest, res);
const userLogin = (userRequest, res) => login(userRequest, res);

const userAuth = passport.authenticate("jwt", { session: false });

/**
 * Checks if the provided user role is included in the roles list
 * @param {Array} roles - list of accepted roles.
 * @const checkRole
 */
const checkRole = (roles) => (req, res, next) => {
  let rolesList = [];
  roles.forEach(element => {
    rolesList.push(element.value);
  });
  !rolesList.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();
};

/**
 * returns json of user data.
 * @const serializeUser
 */
const serializeUser = (user) => {
  return {username: user.username, email: user.email, updatedAt: user.updatedAt, createdAt: user.createdAt};
};

module.exports = {userAuth, userLogin, userRegister, checkRole, serializeUser};