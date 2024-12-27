import User from '../models/userModel.js';


export const addBookToLibrary = async (req, res) => {
    const { id } = req.params; 
    const { title, author, genre, publishedYear } = req.body; 
  
    try {
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.library.push({ title, author, genre, publishedYear });
      await user.save();
  
      res.status(201).json({ message: "Book added to library", library: user.library });
    } catch (error) {
      console.error("Error adding book to library:", error);
      res.status(500).json({ message: "Error adding book to library" });
    }
  };
  