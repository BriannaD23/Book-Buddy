import { decodeTokenPayload } from "../utils/cookieUtils.js";

const API_URL = "http://localhost:5000/api/users";

const fetchBookDetailsFromGoogle = async (bookId) => {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch book details from Google Books API");
    }

    const data = await response.json();
    const { volumeInfo } = data;

    console.log("volumeInfo:", volumeInfo); 

    if (
      !volumeInfo ||
      !volumeInfo.title ||
      !volumeInfo.authors ||
      volumeInfo.authors.length === 0
    ) {
      throw new Error("Missing title or author in book details");
    }

    const title = volumeInfo.title;
    const author = volumeInfo.authors[0];
    const coverImage = volumeInfo.imageLinks?.thumbnail || null;

    return { title, author, coverImage };
  } catch (error) {
    console.error(
      "Error fetching book details from Google Books API:",
      error.message
    );
    throw error;
  }
};

export const addBookToLibrary = async (bookId) => {
    try {
      console.log("Fetching book details for bookId:", bookId);
      const { title, author, coverImage } = await fetchBookDetailsFromGoogle(bookId);
      console.log("Fetched book details:", { title, author, coverImage });
  
      const decodedPayload = decodeTokenPayload();
  
      if (!decodedPayload?.userId) {
        throw new Error("No userId found in the token");
      }
  
      const { userId, token } = decodedPayload;
  
      // Log the data being sent
      console.log("Sending data to backend:", { title, author, coverImage });
  
      const response = await fetch(`${API_URL}/${userId}/library`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
          title,
          author,
          coverImage,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Add Book Error Response:", errorData);
        throw new Error(errorData.message || "Failed to add the book.");
      }
  
      const data = await response.json();
      console.log("Book added to library:", data);
    } catch (error) {
      console.error("Error adding book:", error.message);
    }
  };
  

// Get the user's library
export const getLibrary = async () => {
  try {
    const decodedPayload = decodeTokenPayload();

    if (!decodedPayload?.userId) {
      throw new Error("No userId found in the token");
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
      console.error("Get Library Error Response:", errorData);
      throw new Error(errorData.message || "Failed to fetch the library.");
    }

    const libraryData = await response.json();
    return Array.isArray(libraryData) ? libraryData : libraryData.library || [];
  } catch (error) {
    console.error("Error fetching library:", error.message);
    return [];
  }
};
