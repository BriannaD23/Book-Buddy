import mongoose from "mongoose";
import User from "../models/userModel.js";


export const addBookToLibrary = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { coverImage, bookId } = req.body;

      console.log("Received coverImage:", coverImage);
      console.log("Received bookId:", bookId);
  
    
      console.log("Received coverImage:", coverImage);
  
    
  
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newBook = {
        bookId,    // Corrected variable name to bookId
        coverImage,
      };
  
  
      user.library.mybooks.push(newBook);
  
      console.log("New book to be added:", newBook);
  
      await user.save();
  
      return res.status(200).json(user.library.mybooks);
    } catch (error) {
        console.error("Mongoose Validation Error:", error.errors);
      return res.status(500).json({ message: "Error adding book to library", error: error.message });
    }
  };

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
  
      // Access mybooks inside user.library
      return res.status(200).json(user.library.mybooks); 
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error retrieving library", error: error.message });
    }
  };
 
// ------------------------Pending Books------------------------//
  // export const addBookToPending = async (req, res) => {
  //   try {
  //     const userId = req.params.userId;
  //     const { bookId, bookCover } = req.body;
  
  //     // Validate userId as a valid MongoDB ObjectId
  //     if (!mongoose.Types.ObjectId.isValid(userId)) {
  //       return res.status(400).json({ message: "Invalid User ID" });
  //     }
  
  //     // Find the user in the database
  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: "User not found" });
  //     }
  
  //     // Validate the bookId and bookCover
  //     if (!bookId || !bookCover) {
  //       return res.status(400).json({ message: "Book ID and cover are required." });
  //     }
  
  //     console.log("Adding book to pending list:", { userId, bookId, bookCover });
  
  //     // Simulate adding the book to the pending list
  //     const pendingBook = {
  //       bookId,
  //       bookCover,
  //     };
  
  //     // Add the pending book to the user's 'library.pending' list
  //     user.library = user.library || {};  // Ensure user.library exists
  //     user.library.pending = [...(user.library.pending || []), pendingBook];
  //     console.log("User before save:", user);
  
  //     const savedUser = await user.save();
  //     if (!savedUser) {
  //       throw new Error("Failed to save user with updated pending list.");
  //     }
  
  //     console.log("Book added to pending:", pendingBook);
  
  //     // Respond with success
  //     res.status(200).json({
  //       message: "Book successfully added to pending list.",
  //       pendingBook,
  //     });
  //   } catch (error) {
  //     console.error("Error adding book to pending:", error.message);
  //     res.status(500).json({ message: "Failed to add book to pending list.", error: error.message });
  //   }
  // };
  export const addBookToPending = async (req, res) => {
    try {
      const userId = req.params.userId;
      const { bookId, coverImage } = req.body; // Changed bookCover to coverImage
    
      // Validate userId as a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid User ID" });
      }
    
      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    
      // Validate the bookId and coverImage
      if (!bookId || !coverImage) {
        return res.status(400).json({ message: "Book ID and cover image are required." });
      }
    
      console.log("Adding book to pending list:", { userId, bookId, coverImage });
    
      // Simulate adding the book to the pending list
      const pendingBook = {
        bookId,
        coverImage, // Changed from bookCover to coverImage
      };
    
      // Add the pending book to the user's 'library.pending' list
      user.library = user.library || {};  // Ensure user.library exists
      user.library.pending = [...(user.library.pending || []), pendingBook];
      console.log("User before save:", user);
    
      const savedUser = await user.save();
      if (!savedUser) {
        throw new Error("Failed to save user with updated pending list.");
      }
    
      console.log("Book added to pending:", pendingBook);
    
      // Respond with success
      res.status(200).json({
        message: "Book successfully added to pending list.",
        pendingBook,
      });
    } catch (error) {
      console.error("Error adding book to pending:", error.message);
      res.status(500).json({ message: "Failed to add book to pending list.", error: error.message });
    }
  };
  
  

  // Controller to fetch pending books
export const getPendingBooks = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId as a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // Find the user and populate the pending list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has any pending books
    const pendingBooks = user.library?.pending || [];

    if (pendingBooks.length === 0) {
      return res.status(200).json({ message: "No books in the pending list." });
    }

    // Respond with the list of pending books
    res.status(200).json({ message: "Pending books fetched successfully", pendingBooks });
  } catch (error) {
    console.error("Error fetching pending books:", error.message);
    res.status(500).json({ message: "Failed to fetch pending books", error: error.message });
  }
};
