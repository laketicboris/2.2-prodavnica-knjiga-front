import React, { useEffect, useState } from "react";
import { getAllBooks, deleteBook } from "../service/service";
import { useNavigate } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await getAllBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Books fetch error:", e);
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
      <h2 className="page-title">📖 Books</h2>
      {books.length === 0 ? (
        <div className="no-data">No books available.</div>
      ) : (
        <table className="data-table">
          <colgroup>
            <col style={{ width: "64px" }} />
            <col style={{ width: "28%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "140px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "120px" }} />
          </colgroup>

          <thead>
            <tr>
              <th className="id-column">ID</th>
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
            {books.map((book) => (
              <tr key={book.id}>
                <td className="id-column">{book.id}</td>
                <td className="title-column">{book.title}</td>
                <td className="isbn-column">{book.isbn}</td>
                <td className="date-column">
                  {book.publishedDate
                    ? new Date(book.publishedDate).toLocaleDateString("sr-RS")
                    : "N/A"}
                </td>
                <td className="pages-column">{book.pageCount}</td>
                <td className="author-column">
                  {book.author ? book.author.fullName : "Unknown Author"}
                </td>
                <td className="publisher-column">
                  {book.publisher ? book.publisher.name : "Unknown Publisher"}
                </td>
                <td className="actions-column">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/edit-book/${book.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
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
