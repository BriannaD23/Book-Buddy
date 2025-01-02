import mongoose from "mongoose";
import User from "../models/userModel.js";

// Get a user's library
export const getLibrary = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the ObjectId from the URL

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId); // Use the ObjectId to query the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.library); // Return the user's library
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error retrieving library", error: error.message });
  }
};

// Add a book to a user's library
export const addBookToLibrary = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract the ObjectId from the URL
    const { title, author, genre, publishedYear } = req.body;

    // Ensure that the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId); // Use the ObjectId to query the database
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new book to the user's library
    const newBook = { title, author, genre, publishedYear };
    user.library.push(newBook);

    // Save the updated user object
    await user.save();

    return res.status(200).json(user.library); // Return the updated library
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding book to library", error: error.message });
  }
};
