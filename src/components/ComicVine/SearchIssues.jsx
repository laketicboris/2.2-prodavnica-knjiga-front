import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchIssuesByVolume, createIssue } from "../../service/service";
import UserContext from "../User/UserContext.jsx";

const SearchIssues = () => {
  const { volumeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    availableCopies: "1",
    additionalNotes: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  const cleanHtmlText = (htmlString) => {
    if (!htmlString) return "";
    
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    
    const cleanText = tempDiv.textContent || tempDiv.innerText || "";
    

    if (cleanText.length > 250) {
      return cleanText.substring(0, 250) + "...";
    }
    
    return cleanText;
  };

  useEffect(() => {
    if (!user || user.role !== "Editor") {
      navigate("/books");
      return;
    }
    
    if (volumeId) {
      fetchIssues();
    }
  }, [user, navigate, volumeId]);

  const fetchIssues = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await searchIssuesByVolume(volumeId);
      setIssues(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Issues search error:", err);
      setError("Failed to fetch issues for this volume.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIssue = (issue) => {
    setSelectedIssue(issue);
    setShowForm(true);
    setFormData({
      price: "",
      availableCopies: "1", 
      additionalNotes: ""
    });
    setError("");
    setMessage("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    
    if (!formData.availableCopies || parseInt(formData.availableCopies) < 0) {
      setError("Please enter valid available copies.");
      return;
    }

    setFormLoading(true);
    setError("");
    setMessage("");

    try {
      const issueData = {
        externalApiId: selectedIssue.id,
        price: parseFloat(formData.price),
        availableCopies: parseInt(formData.availableCopies),
        additionalNotes: formData.additionalNotes || null
      };

      await createIssue(issueData);
      setMessage("Issue saved successfully!");
      setShowForm(false);
      setSelectedIssue(null);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Create issue error:", err);
      setError("Failed to save issue. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedIssue(null);
    setFormData({ price: "", availableCopies: "1", additionalNotes: "" });
    setError("");
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="page-header">
        <h2 className="page-title">📖 Volume Issues</h2>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/volumes/search')}
        >
          ← Back to Volumes
        </button>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && !showForm && <div className="message error">{error}</div>}

      {issues.length === 0 ? (
        <div className="no-data">No issues found for this volume.</div>
      ) : (
        <>
          <div className="results-header">
            <span>Found {issues.length} issue(s)</span>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th className="number-column">#</th>
                <th className="title-column">Issue Name</th>
                <th className="number-column">Issue #</th>
                <th className="date-column">Release Date</th>
                <th className="actions-column">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={issue.id}>
                  <td className="number-column">{index + 1}</td>
                  <td className="title-column">{issue.name || "Untitled Issue"}</td>
                  <td className="number-column">{issue.issue_number || "N/A"}</td>
                  <td className="date-column">
                    {issue.cover_date 
                      ? new Date(issue.cover_date).toLocaleDateString("sr-RS")
                      : "N/A"}
                  </td>
                  <td className="actions-column">
                    <button
                      className="btn-primary"
                      onClick={() => handleCreateIssue(issue)}
                    >
                      💾 Save Issue
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showForm && selectedIssue && (
        <div className="form-overlay">
          <div className="form-container">
            <h3 className="form-title">💾 Save Issue to Library</h3>
            
            {error && <div className="message error">{error}</div>}
            
            <div className="issue-preview">
              <h4>Issue Details:</h4>
              <p><strong>Name:</strong> {selectedIssue.name || "Untitled Issue"}</p>
              <p><strong>Issue Number:</strong> {selectedIssue.issue_number || "N/A"}</p>
              <p><strong>Release Date:</strong> {
                selectedIssue.cover_date 
                  ? new Date(selectedIssue.cover_date).toLocaleDateString("sr-RS")
                  : "N/A"
              }</p>
              {selectedIssue.description && (
                <p><strong>Description:</strong> {cleanHtmlText(selectedIssue.description)}</p>
              )}
            </div>

            <div className="form-card">
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label">Price (RSD) *</label>
                  <input
                    className="form-input"
                    type="number"
                    name="price"
                    step="0.01"
                    min="0"
                    placeholder="199.99"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Copies *</label>
                  <input
                    className="form-input"
                    type="number"
                    name="availableCopies"
                    min="0"
                    placeholder="1"
                    value={formData.availableCopies}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Notes</label>
                  <textarea
                    className="form-input"
                    name="additionalNotes"
                    placeholder="Any additional information about this issue..."
                    value={formData.additionalNotes}
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelForm}
                    disabled={formLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={formLoading}
                  >
                    {formLoading ? "Saving..." : "💾 Save Issue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchIssues;