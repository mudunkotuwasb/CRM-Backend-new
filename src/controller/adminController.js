const User = require('../model/user');

const changeUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({success: false, message: "Status field is required"});
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({success: false, message: "User not found"});

    user.status = status; 
    await user.save();
    return res.status(200).json({success: true, message: "User status updated successfully",
      user: {id: user._id, username: user.username, status: user.status}});
  } catch (error) {
    return res.status(500).json({success: false, message: "Internal Server Error", error: error.message});
  }
};

module.exports = { changeUserStatus };