import mongoose from "mongoose";
import User from "../models/userModel.js";

export const addBookToLibrary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { coverImage, bookId, title, author } = req.body;

    console.log("Received coverImage:", coverImage);
    console.log("Received bookId:", bookId);
    console.log("Received title:", title);
    console.log("Received coverImage:", author);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newBook = {
      bookId, 
      coverImage,
      title,
      author,
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!bookId || !coverImage || !title || !author) {
      return res.status(400).json({
        message:
          "Missing required fields: bookId, coverImage, title, and author.",
      });
    }

    user.library.current = {
      coverImage,
      title,
      author,
      bookId,
      pages: pages || 0, 
      progress: 0, 
      startDate: new Date(), 
      endDate: null,
    };

    console.log("User before save:", user);

    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user with updated current book.");
    }

    console.log("Book added to current:", user.library.current);

    res.status(200).json({
      message: "Book successfully added to current",
      currentBook: user.library.current,
    });
  } catch (error) {
    console.error("Error adding book to current:", error.message);
    res.status(500).json({
      message: "Failed to add book to current.",
      error: error.message,
    });
  }
};

const handleAddCurrentToCompleted = async () => {
  try {
    if (!currentBook || !currentBook.bookId) {
      throw new Error("No current book to add to completed.");
    }

    console.log("Adding current book to completed:", currentBook);

    const result = await addBookToCompleted(
      currentBook.bookId,
      currentBook.coverImage,
      currentBook.title,
      currentBook.author
    );

    console.log("API response:", result);

    if (result.success) {
      setCurrentBook(null);
      setIsEditing(false);
      console.log("CurrentBook cleared after completing");

      await loadCompleteLibrary();
    } else {
      throw new Error(result.message || "Failed to add current book to completed.");
    }
  } catch (error) {
    console.error("Error moving current book to completed:", error);
    alert(error.message);
  }
};


export const addBookToPending = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bookId, coverImage, title, author } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!bookId || !coverImage) {
      return res
        .status(400)
        .json({ message: "Book ID and cover image are required." });
    }

    console.log("Adding book to pending list:", {
      userId,
      bookId,
      coverImage,
      title,
      author,
    });

    const pendingBook = {
      bookId,
      coverImage,
      title,
      author,
    };

    user.library = user.library || {};
    user.library.pending = [...(user.library.pending || []), pendingBook];
    console.log("User before save:", user);

    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user with updated pending list.");
    }

    console.log("Book added to pending:", pendingBook);

    res.status(200).json({
      message: "Book successfully added to pending list.",
      pendingBook,
    });
  } catch (error) {
    console.error("Error adding book to pending:", error.message);
    res.status(500).json({
      message: "Failed to add book to pending list.",
      error: error.message,
    });
  }
};

export const addBookToCompleted = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookId, coverImage, title, author } = req.body;

    console.log("Request received to add book to completed:", { userId, bookId, coverImage, title, author });

    if (!mongoose.Types.ObjectId.isValid(userId) || !bookId) {
      console.log('Invalid User ID or Book ID');
      return res.status(400).json({ message: "Invalid User ID or Book ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.library.completed = user.library.completed || [];

    if (user.library.completed.some((b) => b.bookId === bookId)) {
      console.log('Book already marked as completed:', bookId);
      return res.status(400).json({ message: "Book is already completed." });
    }

    const completedBook = {
      bookId,
      coverImage,
      title: title || "Unknown Title",
      author: author || "Unknown Author",
    };

    console.log('Adding book to completed list:', completedBook);

    user.library.completed.push(completedBook);
    await user.save();
    console.log('User after saving:', user);

    res.status(200).json({ message: "Book added to completed list.", completedBook });
  } catch (error) {
    console.error('Error occurred while adding book to completed list:', error.message);
    res.status(500).json({
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

    const currentBook = user.library?.current || null;

 
    if (!currentBook) {
      return res.status(404).json({ message: "No current book found" });
    }

    return res.status(200).json({
      message: "Current book retrieved successfully",
      currentBook: currentBook, 
    });
  } catch (error) {
    console.error("Error fetching current book:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch current book", error: error.message });
  }
};

export const updateCurrentBook = async (req, res) => {
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

     console.log("Update body:", req.body);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.library.current || user.library.current.bookId !== bookId) {
      return res.status(404).json({ message: "Current book not found." });
    }

  user.library.current.coverImage = coverImage ?? user.library.current.coverImage;
  user.library.current.title = title ?? user.library.current.title;
  user.library.current.author = author ?? user.library.current.author;
  user.library.current.pages = (pages !== undefined && pages !== null && pages !== "") ? Number(pages) : user.library.current.pages;
  user.library.current.progress = (progress !== undefined && progress !== null && progress !== "") ? Number(progress) : user.library.current.progress;
  user.library.current.startDate = startDate ?? user.library.current.startDate;
  user.library.current.endDate = endDate ?? user.library.current.endDate;

    await user.save();

    res.status(200).json({
      message: "Current book updated successfully",
      currentBook: user.library.current,
    });
  } catch (error) {
    console.error("Error updating current book:", error.message);
    res.status(500).json({
      message: "Failed to update current book",
      error: error.message,
    });
  }
};

export const getPendingBooks = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    const completedBooks = user.library?.completed || [];

    if (completedBooks.length === 0) {
      return res.status(200).json({ message: "No books in the pending list." });
    }

    res.status(200).json({
      message: "Completed books fetched successfully",
      completedBooks,
    });
  } catch (error) {
    console.error("Error fetching completed books:", error.message);
    res.status(500).json({
      message: "Failed to fetch completed books",
      error: error.message,
    });
  }
};

export const deleteFromPending = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(bookId)
    ) {
      return res.status(400).json({ message: "Invalid User ID or Book ID." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

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

    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Failed to save user after removing book.");
    }

    res.status(200).json({
      message: "Book successfully removed from My Library.",
      removedBook,
    });
  } catch (error) {
    console.error("Error removing book from My Library:", error.message);
    res.status(500).json({
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
    res.status(500).json({
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

    user.library.current.bookId = null;
    user.library.current.coverImage = null;

    await user.save();

    res.status(200).json({
      message: "Current book successfully removed.",
      removedBookId: bookId, 
      currentBook: user.library.current, 
    });
  } catch (error) {
    console.error("Error deleting current book:", error.message);
    res.status(500).json({
      message: "An error occurred while deleting the current book.",
      error: error.message,
    });
  }
};
