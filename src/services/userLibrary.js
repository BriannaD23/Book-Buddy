import { decodeTokenPayload } from "../utils/cookieUtils.js";

const API_URL = "http://localhost:5000/api/users"; // Base URL for user-related routes

const fetchBookDetailsFromGoogle = async (bookId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch book details from Google Books API");
      }
  
      const data = await response.json();
      const { volumeInfo } = data;
      const { title, authors } = volumeInfo;
  
      if (!title || !authors || authors.length === 0) {
        throw new Error("Missing title or author in book details");
      }
  
      return { title, author: authors[0] }; 
    } catch (error) {
      console.error("Error fetching book details from Google Books:", error.message);
      throw error;
    }
  };
  
  export const addBookToLibrary = async (bookId) => {
    try {
      // Step 1: Fetch book details from Google Books API
      const bookDetails = await fetchBookDetailsFromGoogle(bookId);
      console.log("Fetched Book Details from Google Books API:", bookDetails);
  
      const { title, author } = bookDetails;
  
      // Step 2: Decode token and fetch userId
      const decodedPayload = decodeTokenPayload();
      if (!decodedPayload || !decodedPayload.userId) {
        console.error("No userId found in the token");
        return;
      }
  
      const { userId, token } = decodedPayload;
  
      // Step 3: Make POST request to add the book to the library
      const response = await fetch(`${API_URL}/${userId}/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookId, title, author }), // Add book title and author
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add the book.");
      }
  
      const data = await response.json();
      console.log("Book added to library:", data);
    } catch (error) {
      console.error("Error adding book:", error.message);
    }
  };

export const getLibrary = async () => {
  try {
    const decodedPayload = decodeTokenPayload();
    if (!decodedPayload || !decodedPayload.userId) {
      console.error("No userId found in the token");
      return;
    }
    const { userId, token } = decodedPayload;

    const response = await fetch(`${API_URL}/${userId}/library`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch the library.");
    }

    const libraryData = await response.json();
    console.log("Library Data:", libraryData);
  } catch (error) {
    console.error("Error fetching library:", error.message);
  }
};
