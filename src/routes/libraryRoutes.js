
import express from 'express';
import {getLibrary, addBookToLibrary,addBookToPending, getPendingBooks, deleteFromPending,  deleteMyLibraryBook  } from '../controllers/libraryController.js';  // Import controller functions

const router = express.Router();

// Route to get the user's library (mybooks)
router.get('/:userId/library/mybooks', getLibrary);

// Route to add a book to 'mybooks' section
router.post('/:userId/library/mybooks', addBookToLibrary);


router.post('/:userId/library/pending', addBookToPending);


router.get('/:userId/library/pending', getPendingBooks);

router.delete('/:userId/library/pending/:bookId', deleteFromPending);

router.delete('/:userId/library/mybooks/:bookId',  deleteMyLibraryBook );




// // Route to get the user's current books
// router.get('/:userId/library/current', getCurrentBooks);

// // Route to add a book to 'current' section
// router.post('/:userId/library/current', addBookToCurrent);

export default router;

