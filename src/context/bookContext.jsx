import React, { createContext, useState, useContext, useEffect } from 'react';

const BooksContext = createContext();

export const useBooks = () => useContext(BooksContext);

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  const fetchBooks = async (query = 'Fiction', startIndex = 0, resultsPerPage = 16) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${resultsPerPage}&orderBy=relevance`
      );
      const data = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBook = async (book) => {
    if (!userId) {
      console.error("User ID is not available");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          coverImage: book.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
          title: book.volumeInfo.title,
          authors: book.volumeInfo.authors || ["Unknown Author"],
          description: book.volumeInfo.description || "No description available",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add book");
      }

      console.log("Book added successfully:", await response.json());
      fetchBooks(); // Refresh the book list
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <BooksContext.Provider value={{ books, fetchBooks, addBook, userId, setUserId }}>
      {children}
    </BooksContext.Provider>
  );
};