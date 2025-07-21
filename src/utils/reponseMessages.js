const { deleteAll } = require("../controller/dataController");

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const registration
 */
const registration = {
    usernameExists: "Username is already taken.",
    emailExists: "Email is already registered.",
    signupSuccess: "You are successfully signed up.",
    signupError: "Unable to create your account.",
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const loginMSG
 */
const loginMSG = {
  isRequiredEmpty: "Email and password are required",
  emailNotExist: "Email is not found. Invalid login credentials.",
  userNotExist: "User not found",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const changeUserStatusMSG
 */
const changeUserStatusMSG = {
  isStatusEmpty: "Status field is required.",
  userNotExist: "User not found.",
  updateStatusSuccess: "User status updated successfully.",
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const addContactMSG
 */
const addContactMSG = {
  isUploadedByEmpty: "Uploaded by field is required.",
  isUploadedByValied: "Invalid User ID for uploaded by field",
  uploadedByNotExist: "User not found.",
  addContactSucccess: "Contact added successfully"

};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const updateContactMSG
 */
const updateContactMSG = {
  contactNotExist: "Contact not found",
  updateContactSuccess: "Contact updated successfully"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const getContactsByEmailMSG
 */
const getContactsByEmailMSG = {
  isEmailEmpty: "Email is required",
  contactNotExist: "Contact not found"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const changeContactStatusMSG
 */
const changeContactStatusMSG = {
  isStatusEmpty: "Status is required",
  contactNotExist: "Contact not found",
  updateStatusSuccess: "Contact status updated successfully"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const getContactsByStatusMSG
 */
const getContactsByStatusMSG ={
  isStatusEmpty: "Status is required",
  isNotContactMatch: "No contacts found with the specified status"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const deleteTemporarilyMSG
 */
const deleteTemporarilyMSG = {
  isNotValidId: "Invalid ID format",
  contactNotExist: "Contact not found",
  isIsDeletedTrue: "Contact is already marked as deleted",
  isDeletedTrueSuccess: "Contact deleted temporarily"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const restoreRecordMSG
 */
const restoreRecordMSG = {
  isNotValidId: "Invalid ID format",
  contactNotExist: "Contact not found",
  isIsDeletedTrue: "Contact is not deleted",
  isDeletedFalseSuccess: "Contact restored successfully"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const deletePermanentlyMSG
 */
const deletePermanentlyMSG = {
  isNotValidId: "Invalid ID format",
  contactNotExist: "Contact not found",
  isNotIsDeletedTrue: "Contact is not marked as deleted. Cannot permanently delete.",
  deletePermanentlySuccess: "Contact permanently deleted"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const deleteAllMSG
 */
const deleteAllMSG = {
   deleteAllSuccess: "All temporarily deleted records permanently removed."
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const resetPasswordMSG
 */
const resetPasswordMSG = {
  userNotExist: "User not found",
  isPasswordInvalid: "Incorrect current password",
  resetPasswordSuccess: "Password updated successfully"
};

/**
 * Contains messages returned by the server when exceptions are caught.
 * @const adminAuthMSG
 */
const adminAuthMSG = {
  isValidAuthHeader: "No token provided",
  isInvalidToken: "Invalid token"
};

module.exports = {
    registration,
    loginMSG,
    changeUserStatusMSG,
    addContactMSG,
    updateContactMSG,
    getContactsByEmailMSG,
    changeContactStatusMSG,
    getContactsByStatusMSG,
    deleteTemporarilyMSG,
    deleteAllMSG,
    restoreRecordMSG,
    deletePermanentlyMSG,
    resetPasswordMSG,
    adminAuthMSG
};