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
      bookId, // Corrected variable name to bookId
      coverImage,
    };

    user.library.mybooks.push(newBook);

    console.log("New book to be added:", newBook);

    await user.save();

    return res.status(200).json(user.library.mybooks);
  } catch (error) {
    console.error("Mongoose Validation Error:", error.errors);
    return res
      .status(500)
      .json({ message: "Error adding book to library", error: error.message });
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
    return res
      .status(500)
      .json({ message: "Error retrieving library", error: error.message });
  }
};

export const addBookToCurrentFromLibrary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      bookId,
      coverImage,
      title,
      author,
      pages,
      progress,
      startDate,
      endDate,
    } = req.body;

    // Check if the userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate bookId and coverImage are provided
    if (!bookId || !coverImage) {
      return res
        .status(400)
        .json({ message: "Book ID and cover image are required." });
    }

    // Check if there is already a book in the current list
    // if (user.library.current && Object.keys(user.library.current).length > 0) {
    //   return res.status(400).json({ message: "You can only have one book in your current list at a time." });
    // }

    // Assign the new book to the current list
    user.library.current = {
      coverImage,
      title,
      author,
      bookId,
      pages,
      progress: 0, // Initial progress can be 0 or any other default value you need
      startDate: new Date(),
      endDate: null, // endDate can be set when the user finishes the book
    };

    // Optionally, you could also remove the book from `mybooks` and/or `pending`
    // user.library.mybooks = user.library.mybooks.filter(book => book.bookId !== bookId);

    console.log("User before save:", user);

    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user with updated current book.");
    }

    console.log("Book added to current:", user.library.current);

    // Respond with success
    res.status(200).json({
      message: "Book successfully added to current",
      currentBook: user.library.current,
    });
  } catch (error) {
    console.error("Error adding book to current:", error.message);
    res
      .status(500)
      .json({
        message: "Failed to add book to current.",
        error: error.message,
      });
  }
};

export const addBookToPending = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bookId, coverImage } = req.body;
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
      return res
        .status(400)
        .json({ message: "Book ID and cover image are required." });
    }

    console.log("Adding book to pending list:", { userId, bookId, coverImage });

    const pendingBook = {
      bookId,
      coverImage,
    };

    user.library = user.library || {};
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
    res
      .status(500)
      .json({
        message: "Failed to add book to pending list.",
        error: error.message,
      });
  }
};

export const addBookToCompleted = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, coverImage } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!bookId || !coverImage) {
      return res
        .status(400)
        .json({ message: "Book ID and cover image are required." });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize library and books array if necessary
    user.library = user.library || {};
    user.library.completed = user.library.completed || [];

    // Add the book to the completed books array
    const completedBook = { bookId, coverImage };
    user.library.completed.push(completedBook);

    // Save the updated user document
    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user with updated completed books.");
    }

    res.status(200).json({
      message: "Book successfully added to completed list.",
      completedBook,
    });
  } catch (error) {
    console.error("Error adding book to completed:", error.message);
    res
      .status(500)
      .json({
        message: "Failed to add book to completed list.",
        error: error.message,
      });
  }
};

export const getCurrentBook = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch current book from the user's library
    const currentBook = user.library?.current || null;

    // If there is no current book, send a response indicating that
    if (!currentBook) {
      return res.status(404).json({ message: "No current book found" });
    }

    // Return the current book
    return res.status(200).json({
      message: "Current book retrieved successfully",
      currentBook: currentBook, // Assuming it's an object, not an array
    });
  } catch (error) {
    console.error("Error fetching current book:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch current book", error: error.message });
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
    res
      .status(200)
      .json({ message: "Pending books fetched successfully", pendingBooks });
  } catch (error) {
    console.error("Error fetching pending books:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch pending books", error: error.message });
  }
};


export const loadCompletedBooks = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const completedBooks = user.library?.completed ||  [];


    if (completedBooks.length === 0) {
      return res.status(200).json({ message: "No books in the pending list." });
    }

    res
      .status(200)
      .json({ message: "Completed books fetched successfully", completedBooks});
  } catch (error) {
    console.error("Error fetching completed books:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch completed books", error: error.message });
  }
};

export const deleteFromPending = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    // Validate userId and bookId
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid User ID or Book ID." });
    }

    // Fetch user and check existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if pending list exists and contains books
    const pendingBooks = user.library?.pending || [];
    const bookIndex = pendingBooks.findIndex(
      (book) => book._id.toString() === bookId
    );

    if (bookIndex === -1) {
      return res
        .status(404)
        .json({ message: "Book not found in pending list." });
    }

    const [removedBook] = pendingBooks.splice(bookIndex, 1);

    await user.save();

    res.status(200).json({
      message: "Book successfully removed from pending list.",
      removedBook,
    });
  } catch (error) {
    console.error("Error removing book from pending list:", error.message);
    res.status(500).json({
      message: "An error occurred while removing the book.",
      error: error.message,
    });
  }
};

export const deleteMyLibraryBook = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid User ID or Book ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.library ||
      !user.library.mybooks ||
      user.library.mybooks.length === 0
    ) {
      return res.status(400).json({ message: "No books found in My Library." });
    }

    console.log("Received bookId:", bookId);

    const bookIndex = user.library.mybooks.findIndex(
      (book) => book._id.toString() === bookId
    );
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found in My Library." });
    }

    const removedBook = user.library.mybooks.splice(bookIndex, 1)[0];

    // Save the updated user
    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user after removing book.");
    }

    // Respond with success
    res.status(200).json({
      message: "Book successfully removed from My Library.",
      removedBook,
    });
  } catch (error) {
    console.error("Error removing book from My Library:", error.message);
    res
      .status(500)
      .json({
        message: "Failed to remove book from My Library.",
        error: error.message,
      });
  }
};


export const deleteCompletedBooks = async (req, res) => {
  try {
    const { userId, bookId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid User ID or Book ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.library ||
      !user.library.completed ||
      user.library.completed.length === 0
    ) {
      return res.status(400).json({ message: "No books found in Completed." });
    }

    console.log("Received bookId:", bookId);

    const bookIndex = user.library.completed.findIndex(
      (book) => book._id.toString() === bookId
    );
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found in complated." });
    }

    const removedBook = user.library.completed.splice(bookIndex, 1)[0];

    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user after removing book.");
    }

    res.status(200).json({
      message: "Book successfully removed from completed Library.",
      removedBook,
    });
  } catch (error) {
    console.error("Error removing book from completed:", error.message);
    res
      .status(500)
      .json({
        message: "Failed to remove book from completed.",
        error: error.message,
      });
  }
};


export const deleteCurrentBook = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.library.current || user.library.current.bookId !== bookId) {
      return res
        .status(404)
        .json({ message: "Current book not found or does not match." });
    }

    // Clear the bookId from the current book
    user.library.current.bookId = null;
    user.library.current.coverImage = null;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: "Current book successfully removed.",
      removedBookId: bookId, // Optionally return the removed bookId
      currentBook: user.library.current, // Return the updated current book structure
    });
  } catch (error) {
    console.error("Error deleting current book:", error.message);
    res.status(500).json({
      message: "An error occurred while deleting the current book.",
      error: error.message,
    });
  }
};
