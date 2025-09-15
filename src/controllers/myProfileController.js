import mongoose from "mongoose";
import User from "../models/userModel.js";



export const updateProfilePic = async (req, res) => {
  try {
    const { userId } = req.params;      
    const { photoURL } = req.body;     

    if (!photoURL) {
      return res.status(400).json({ success: false, message: "photoURL is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { photoURL } },
      { new: true }                     
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating profile picture:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


