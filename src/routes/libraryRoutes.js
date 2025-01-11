
import express from 'express';
import {getLibrary, addBookToLibrary,addBookToPending } from '../controllers/libraryController.js';  // Import controller functions

const router = express.Router();

// Route to get the user's library (mybooks)
router.get('/:userId/library/mybooks', getLibrary);

// Route to add a book to 'mybooks' section
router.post('/:userId/library/mybooks', addBookToLibrary);


router.post('/:userId/library/pending', addBookToPending);


// // Route to get the user's pending books
// router.get('/:userId/library/pending', getPendingBooks);


// Route to add a book to 'pending' section
// router.post('/:userId/library/pending', addBookToPending);


// // Route to get the user's current books
// router.get('/:userId/library/current', getCurrentBooks);

// // Route to add a book to 'current' section
// router.post('/:userId/library/current', addBookToCurrent);

export default router;

