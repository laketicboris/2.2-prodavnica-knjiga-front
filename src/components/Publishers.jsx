import React, { useState, useEffect } from "react";
import { getAllPublishers, getPublisherSortTypes } from "../service/service";

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [sortTypes, setSortTypes] = useState([]);
  const [selectedSortType, setSelectedSortType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSortTypes = async () => {
    try {
      const data = await getPublisherSortTypes();
      console.log("Sort types:", data);
      setSortTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch sort types:", e);
    }
  };

  const fetchPublishers = async (sortType) => {
    try {
      setLoading(true);
      const data = await getAllPublishers(sortType);
      console.log("Publishers response:", data);
      setPublishers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Publishers fetch error:", e?.response?.status, e?.response?.data, e);
      setError("Failed to fetch publishers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSortTypes();
  }, []);

  useEffect(() => {
    fetchPublishers(selectedSortType);
  }, [selectedSortType]);

  const handleSortChange = (e) => {
    const newSortType = parseInt(e.target.value, 10);
    setSelectedSortType(newSortType);
  };

  if (loading) return (
    <div className="table-container">
      <div className="loading">Loading publishers...</div>
    </div>
  );

  if (error) return (
    <div className="table-container">
      <div className="error">{error}</div>
    </div>
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="page-title">🏢 Publishers</h2>
        
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

      {publishers.length === 0 ? (
        <div className="no-data">No publishers available.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th className="number-column">#</th>
              <th className="title-column">Name</th>
              <th>Address</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((p, index) => (
              <tr key={p.id}>
                <td className="number-column">{index + 1}</td>
                <td className="title-column">{p.name}</td>
                <td>{p.address}</td>
                <td>
                  <a href={p.website} target="_blank" rel="noopener noreferrer">
                    {p.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Publishers;