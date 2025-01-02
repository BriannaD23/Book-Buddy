export const fetchBooks = async (query) => {
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