// Modules
const bcrypt = require("bcryptjs");

// Imports
const {
  validateEmail,
  validateUsername,
  signupSchema,
} = require("../../validators/authValidations");
const User = require("../../model/user");
const {registration} = require("../../utils/reponseMessages")

/**
 * Creates a new user.
 * @async
 * @function register
 * @param {Object} userRequest - The data of the user ().
 * @param {string} role - The role of the user {admin, management, marketing_staff, company_representative}.
 * @return {Object} contains 2 attributes {error/success message : string, success : boolean}.
 */
const register = async (userRequest, res) => {
  try {

    const signupRequest = await signupSchema.validateAsync(userRequest);
    // Validate the username
    let usernameNotTaken = await validateUsername(signupRequest.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: registration.usernameExists,
        success: false,
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(signupRequest.email);
    if (!emailNotRegistered) {
      return res.status(400).json({message: registration.emailExists, success: false})};

    // Get the hashed password
    const password = await bcrypt.hash(signupRequest.password, 12);
    // create a new user
    const newUser = new User({
      ...signupRequest,
      password
    });

    await newUser.save();
    return res.status(201).json({message: registration.signupSuccess, success: true});
  } catch (err) {
    // If the error is a Joi validation error, set the status to 403
    let errorMsg = registration.signupError;
    if (err.isJoi === true) {err.status = 403, errorMsg = err.message};
    return res.status(err.status || 500).json({message: errorMsg, success: false});
  }
};

module.exports = register;