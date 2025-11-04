import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../components/User/UserContext.jsx";

const BooksList = ({ books, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch (error) {
        console.error('Nevalidan token');
      }
    }
  }, []);

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
          {role === "Editor" && (
            <>
              <th className="actions-column">Edit</th>
              <th className="actions-column">Delete</th>
            </>
          )}
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
            {role === "Editor" && (
              <>
                <td className="actions-column">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/edit-book/${book.id}`)}
                  >
                    ✏️ Edit
                  </button>
                </td>
                <td className="actions-column">
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(book.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BooksList;