import React from "react";
import { useNavigate } from "react-router-dom";

const BooksList = ({ books, onDelete }) => {
  const navigate = useNavigate();

  if (books.length === 0) {
    return <div className="no-data">No books found matching the criteria.</div>;
  }

  return (
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
                onClick={() => onDelete(book.id)}
              >
                🗑️ Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksList;