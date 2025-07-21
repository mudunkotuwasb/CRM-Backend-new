const bcrypt = require("bcryptjs");
const User = require("../model/user");
const { resetPasswordMSG, restoreRecordMSG } = require('../utils/reponseMessages');

const resetPassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: resetPasswordControllerMSG.userNotExist });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: resetPasswordrMSG.isPasswordInvalid });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update and save
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ success: true, message: resetPasswordMSG.resetPasswordSuccess });
  } catch (error) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { resetPassword };