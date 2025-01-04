import { fetchBooks } from "../services/bookServices";

export const getBooks = async (req, res) => {
  const query = req.query.q || "fiction"; 
  const books = await fetchBooks(query);
  res.render("books", { books }); 
};
