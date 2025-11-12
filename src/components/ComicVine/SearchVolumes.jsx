import React, { useState, useContext, useEffect } from "react";
import { searchVolumes } from "../../service/service.js";
import { useNavigate } from "react-router-dom";
import UserContext from "../User/UserContext.jsx";

const SearchVolumes = () => {
  const [query, setQuery] = useState("");
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "Editor") {
      navigate("/books");
    }
  }, [user, navigate]);

  const handleSearch = async (page = 1) => {
    if (!query.trim()) {
      setError("Enter search query.");
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const data = await searchVolumes(query.trim(), page);
      
      setVolumes(Array.isArray(data.data) ? data.data : []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 0);
      setTotalCount(data.totalCount || 0);
      setPageSize(data.pageSize || 10);
      
    } catch (err) {
      console.error("Volumes search error:", err);
      setError("Failed to search volumes.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      handleSearch(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      handleSearch(newPage);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      handleSearch(newPage);
    }
  };

  return (
    <div className="table-container">
      <h2 className="page-title">🔍 Search Comic Volumes</h2>
      
      <div className="search-section">
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Enter volume name (e.g., Batman, Spider-Man, Superman)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="btn-primary search-btn"
            onClick={() => handleSearch(1)}
            disabled={loading}
          >
            {loading ? "Searching..." : "🔍 Search"}
          </button>
        </div>
        
        {error && <div className="message error">{error}</div>}
      </div>

      {hasSearched && (
        <>
          {loading ? (
            <div className="loading">Searching volumes...</div>
          ) : volumes.length === 0 ? (
            <div className="no-data">No volumes found for "{query}".</div>
          ) : (
            <div className="search-results">
              <div className="results-header">
                <span>Found {totalCount} volume(s) - Showing page {currentPage} of {totalPages}</span>
              </div>
              
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="number-column">#</th>
                    <th className="title-column">Volume Name</th>
                    <th className="actions-column">Search Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {volumes.map((volume, index) => (
                    <tr key={volume.id}>
                      <td className="number-column">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="title-column">{volume.name}</td>
                      <td className="actions-column">
                        <button
                          className="btn-secondary"
                          onClick={() => navigate(`/issues/search/${volume.id}`)}
                        >
                          📖 View Issues
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchVolumes;