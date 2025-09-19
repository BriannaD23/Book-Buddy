
import express from 'express';
import {getLibrary, addBookToLibrary, addBookToCurrentFromLibrary, updateCurrentBook, addBookToPending,addBookToCompleted ,getPendingBooks,loadCompletedBooks, deleteFromPending, deleteMyLibraryBook, getCurrentBook, deleteCurrentBook , deleteCompletedBooks, updateGoal, getGoal } from '../controllers/libraryController.js';  

const router = express.Router();

router.get('/:userId/library/mybooks', getLibrary);

router.post('/:userId/library/mybooks', addBookToLibrary);

router.post('/:userId/library/current', addBookToCurrentFromLibrary);

router.put('/:userId/library/goal', updateGoal);  

router.get('/:userId/library/goal', getGoal);  

router.put('/:userId/library/current', updateCurrentBook);  

router.get('/:userId/library/current', getCurrentBook);

router.post('/:userId/library/pending', addBookToPending);

router.get('/:userId/library/pending', getPendingBooks);

router.post('/:userId/library/completed', addBookToCompleted);

router.delete('/:userId/library/completed/:bookId', deleteCompletedBooks);

router.get('/:userId/library/completed', loadCompletedBooks);

router.delete('/:userId/library/pending/:bookId', deleteFromPending);

router.delete('/:userId/library/mybooks/:bookId',  deleteMyLibraryBook );

router.delete('/:userId/library/current/:bookId',  deleteCurrentBook );


export default router;

