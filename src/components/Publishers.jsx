import React, { useState, useEffect } from "react";
import { getAllPublishers } from "../service/service";

const Publishers = () => {
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllPublishers();
        console.log("Publishers response:", data);
        setPublishers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Publishers fetch error:", e?.response?.status, e?.response?.data, e);
        setError("Failed to fetch publishers.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      <h2 className="page-title">🏢 Publishers</h2>
      {publishers.length === 0 ? (
        <div className="no-data">No publishers available.</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th className="id-column">ID</th>
              <th className="title-column">Name</th>
              <th>Address</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map(p => (
              <tr key={p.id}>
                <td className="id-column">{p.id}</td>
                <td className="title-column">{p.name}</td>
                <td>{p.address}</td>
                <td>{p.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Publishers;