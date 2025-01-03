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
  
      console.log("Received title:", title);
      console.log("Received author:", author);
      console.log("Received coverImage:", coverImage);
  
      if (!title || !author) {
        return res.status(400).json({ message: "Title and author are required" });
      }
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const newBook = { 
        title, 
        author, 
        coverImage };
  
      const bookExists = user.library.some(book => book.title === title);
      if (bookExists) {
        return res.status(400).json({ message: "Book already in the library" });
      }
  
      user.library.push(newBook);
  
      console.log("New book to be added:", newBook);
  
      await user.save();
  
      return res.status(200).json(user.library);
    } catch (error) {
        console.error("Mongoose Validation Error:", error.errors);
      return res.status(500).json({ message: "Error adding book to library", error: error.message });
    }
  };
  