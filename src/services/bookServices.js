export const fetchBooks = async (query) => {
    const apiKey = "AIzaSyAt5HuZIUiOCuga-7pu4XPQs8kA8Yh9c0c";
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
};