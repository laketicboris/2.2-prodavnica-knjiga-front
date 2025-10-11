import React, { useEffect, useState } from "react";
import { getAllBooks, getBookSortTypes, deleteBook } from "../service/service";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [sortTypes, setSortTypes] = useState([]);
  const [selectedSortType, setSelectedSortType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchSortTypes = async () => {
    try {
      const data = await getBookSortTypes();
      console.log("Book sort types:", data);
      setSortTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch sort types:", e);
    }
  };

  const fetchBooks = async (sortType) => {
    try {
      setLoading(true);
      const data = await getAllBooks(sortType);
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Books fetch error:", e);
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSortTypes();
  }, []);

  useEffect(() => {
    fetchBooks(selectedSortType);
  }, [selectedSortType]);

  const handleSortChange = (e) => {
    const newSortType = parseInt(e.target.value, 10);
    setSelectedSortType(newSortType);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete book.");
    }
  };

  if (loading)
    return (
      <div className="table-container">
        <div className="loading">Loading books...</div>
      </div>
    );
  if (error)
    return (
      <div className="table-container">
        <div className="error">{error}</div>
      </div>
    );

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="page-title">📖 Books</h2>
        
        <div className="sort-container">
          <label className="sort-label" htmlFor="sortType">Sort by:</label>
          <select
            id="sortType"
            className="sort-select"
            value={selectedSortType}
            onChange={handleSortChange}
          >
            {sortTypes.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="no-data">No books available.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th className="number-column">#</th>
              <th className="title-column">Title</th>
              <th className="isbn-column">ISBN</th>
              <th className="date-column">Publication Date</th>
              <th className="pages-column">Pages</th>
              <th className="author-column">Author</th>
              <th className="publisher-column">Publisher</th>
              <th className="actions-column">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book, index) => (
              <tr key={book.id}>
                <td className="number-column">{index + 1}</td>
                <td className="title-column">{book.title}</td>
                <td className="isbn-column">{book.isbn}</td>
                <td className="date-column">
                  {book.publishedDate
                    ? new Date(book.publishedDate).toLocaleDateString("sr-RS")
                    : "N/A"}
                </td>
                <td className="pages-column">{book.pageCount}</td>
                <td className="author-column">{book.authorFullName || "Unknown"}</td>
                <td className="publisher-column">{book.publisherName || "Unknown"}</td>
                <td className="actions-column">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/edit-book/${book.id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;