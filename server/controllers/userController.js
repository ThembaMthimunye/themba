import userModel from "../models/userModel.js";
import mongoose from "mongoose"; 
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid userId format" });
    }


    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default getUserData;
