// import mongoose from "mongoose";
// import User from "../models/userModel.js";

// // Get a user's library
// export const getLibrary = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid User ID" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.status(200).json(user.library);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error retrieving library", error: error.message });
//   }
// };

// export const addBookToLibrary = async (req, res) => {
//     try {
//       const userId = req.params.userId;
//       const { coverImage } = req.body;

//       console.log("Received coverImage:", coverImage);

//       if (!mongoose.Types.ObjectId.isValid(userId)) {
//         return res.status(400).json({ message: "Invalid User ID" });
//       }

//       const user = await User.findById(userId);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       const newBook = {
//         coverImage };

//       user.library.push(newBook);

//       console.log("New book to be added:", newBook);

//       await user.save();

//       return res.status(200).json(user.library);
//     } catch (error) {
//         console.error("Mongoose Validation Error:", error.errors);
//       return res.status(500).json({ message: "Error adding book to library", error: error.message });
//     }
//   };

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

  export const addBookToPending = async (req, res) => {
    try {
      const { bookId, bookCover } = req.body;
      const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
  
      console.log("Adding book to pending list:", {  bookId, bookCover });
  
      if (!bookId || !bookCover) {
        return res.status(400).json({ message: "Book ID and cover are required." });
      }
  
      // Simulate adding the book to the pending list
      const pendingBook = {
        bookId,
        bookCover,

      };
  
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
  
  
  