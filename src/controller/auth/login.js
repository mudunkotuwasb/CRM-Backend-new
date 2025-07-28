// Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Imports
const { SECRET, TOKEN_EXPIRATION } = require("../../config");
const User = require("../../model/user");
const { loginSchema } = require("../../validators/authValidations");
const loginMSG = require("../../utils/reponseMessages");

/**
 * login a user.
 * @async
 * @function login
 * @param {Object} quest - The data of the user {username, password} where username can be an email.
 * @param {string} role - The role of the user {admin, management, marketing_staff, company_representative}.
 * @return {Object} contains 3 attributes {error/success message : string, success : boolean, reason: string}.
 */
const login = async (userRequest, res) => {
  try {
    await loginSchema.validateAsync(userRequest);
    let { email, password } = userRequest;

    if (!email || !password) return res.status(400).json({ success: false, message: loginMSG.isRequiredEmpty });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: loginMSG.userNotExist });
  
    //  Check for the password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user
      let token = jwt.sign(
        {user_id: user._id, role: user.role, username: user.username, email: user.email, 
          lastLogin: user.lastLogin, status: user.status},SECRET, {expiresIn: "14 days"});

      let result = {
        username: user.username, role: user.role, email: user.email, lastLogin: user.lastLogin, 
        status: user.status, token: `${token}`, expiresIn: TOKEN_EXPIRATION};

      return res.status(200).json({
        ...result,
        message: loginMSG.loginSuccess,
        success: true,
      });
    } else {
      return res.status(403).json({reason: "password", message: loginMSG.wrongPassword, success: false});
    }
  } catch (err) {
    let errorMsg = login.loginError;
    if (err.isJoi === true) {
      err.status = 403;
      errorMsg = err.message;
    }
    return res.status(500).json({
      reason: "server",
      message: errorMsg,
      success: false,
    });
  }
};

module.exports = login;