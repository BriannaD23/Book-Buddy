import express from "express";
import { getLibrary, addBookToLibrary } from "../controllers/libraryCrontroller.js"; 
 

const router = express.Router();

router.get("/:userId/library", getLibrary);

// Route to add a book to the user's library
router.post("/:userId/library", addBookToLibrary);

export default router;
