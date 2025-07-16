const bcrypt = require("bcryptjs");
const User = require("../model/user");

const resetPasswordController = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update and save
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, reason: "server", message: "Internal server error" });
  }
};

module.exports = { resetPasswordController };