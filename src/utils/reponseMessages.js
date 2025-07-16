/**
 * Contains messages returned by the server when exceptions are catched.
 * @const registration
 */
const registration = {
    usernameExists: "Username is already taken.",
    emailExists: "Email is already registered.",
    signupSuccess: "You are successfully signed up.",
    signupError: "Unable to create your account.",
};

/**
 * Contains messages returned by the server when exceptions are catched.
 * @const loginMSG
 */
const loginMSG = {
  usernameNotExist: "Username is not found. Invalid login credentials.",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};

module.exports = {
    registration,
    loginMSG
}