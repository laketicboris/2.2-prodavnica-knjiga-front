import React, { useEffect, useState } from "react";
import { getAllAuthors } from "../service/service";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageSize = 5;

  const fetchAuthors = async (page) => {
    try {
      setLoading(true);
      const data = await getAllAuthors(page, pageSize);
      setAuthors(data.items || []);
      setTotalPages(data.totalPages || 0);
      setPageNumber(data.pageNumber || 1);
    } catch (e) {
      console.error("Authors fetch error:", e);
      setError("Failed to fetch authors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors(pageNumber);
  }, [pageNumber]);

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">Loading authors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <h2 className="page-title">✍️ Authors</h2>
      
      {authors.length === 0 ? (
        <div className="no-data">No authors available.</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th className="number-column">#</th>
                <th className="title-column">Full Name</th>
                <th>Biography</th>
                <th className="date-column">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={author.id}>
                  <td className="number-column">{(pageNumber - 1) * pageSize + index + 1}</td>
                  <td className="title-column">{author.fullName}</td>
                  <td>{author.biography}</td>
                  <td className="date-column">
                    {author.dateOfBirth
                      ? new Date(author.dateOfBirth).toLocaleDateString("sr-RS")
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={handlePreviousPage}
              disabled={pageNumber === 1}
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              className="pagination-btn"
              onClick={handleNextPage}
              disabled={pageNumber === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Authors;