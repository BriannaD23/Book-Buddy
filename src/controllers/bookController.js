import { fetchBooks } from "../services/bookServices";


import { fetchBooks } from "../services/bookService";

export const getBooks = async (req, res) => {
  const query = req.query.q || "fiction"; 
  const books = await fetchBooks(query);
  res.render("books", { books }); 
};
