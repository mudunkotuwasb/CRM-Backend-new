const User = require('../model/user');
const { changeUserStatusMSG } = require("../utils/reponseMessages");

const changeUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({success: false, message: changeUserStatusMSG.isStatusEmpty});
  
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({success: false, message: changeUserStatusMSG.userNotExist});

    user.status = status; 
    await user.save();
    return res.status(200).json({success: true, message: changeUserStatusMSG.updateStatusSuccess,
      user: {id: user._id, username: user.username, status: user.status}});
  } catch (error) {
    return res.status(500).json({success: false, message: errorMsg});
  }
};

module.exports = { changeUserStatus };