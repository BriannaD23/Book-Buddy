import mongoose from "mongoose";
import User from "../models/userModel.js";

// Get a user's library
export const getLibrary = async (req, res) => {
  try {
    const userId = req.params.userId; 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.library); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving library", error: error.message });
  }
};



export const addBookToLibrary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { title, author, coverImage } = req.body;



    console.log("Received title:", title);  // Check if title is received
    console.log("Received author:", author);  // Check if author is received
    console.log("Received coverImage:", coverImage);


    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBook = { title, author, coverImage };
    user.library.push(newBook);

    console.log("New book to be added:", newBook);  

    await user.save();

    return res.status(200).json(user.library);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding book to library", error: error.message });
  }
};
