import React, { useEffect, useState } from "react";
import {
  getAllPublishers,
  getAllAuthors,
  createBook,
  getBookById,
  updateBook,
  createAuthor,
  createPublisher,
} from "../../service/service";
import { useNavigate, useParams } from "react-router-dom";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publicationDate: "",
    pages: "",
    authorId: "",
    publisherId: "",
    newAuthorName: "",
    newPublisherName: "",
    newPublisherAddress: "",
    newPublisherWebsite: "",
  });

  const [publishers, setPublishers] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewPublisher, setShowNewPublisher] = useState(false);

  const loadInitialData = async () => {
    try {
      const [pubs, auths] = await Promise.all([
        getAllPublishers(), 
        getAllAuthors(1, 100)
      ]);
      
      const pubsArr = Array.isArray(pubs) ? pubs : [];
    
      const authsArr = auths?.items || [];
      
      setPublishers(pubsArr);
      setAuthors(Array.isArray(authsArr) ? authsArr : []);
    } catch (e) {
      console.error("Failed to load data:", e);
      setMessage("Failed to load data.");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadBookData = async () => {
    if (!id) return;
    try {
      const book = await getBookById(id);
      setFormData(prev => ({
        ...prev,
        title: book.title || "",
        isbn: book.isbn || "",
        publicationDate: book.publishedDate ? book.publishedDate.split("T")[0] : "",
        pages: book.pageCount?.toString() || "",
        authorId: book.authorId?.toString() || "",
        publisherId: book.publisherId?.toString() || "",
      }));
    } catch (e) {
      console.error("Failed to load book:", e);
      setMessage("Failed to load book.");
    }
  };

  useEffect(() => {
    loadBookData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value ?? "" }));
  };

  const handleAuthorChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewAuthor(true);
      setFormData(prev => ({ ...prev, authorId: "", newAuthorName: "" }));
    } else {
      setShowNewAuthor(false);
      setFormData(prev => ({ ...prev, authorId: value, newAuthorName: "" }));
    }
  };

  const handlePublisherChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewPublisher(true);
      setFormData(prev => ({
        ...prev,
        publisherId: "",
        newPublisherName: "",
        newPublisherAddress: "",
        newPublisherWebsite: ""
      }));
    } else {
      setShowNewPublisher(false);
      setFormData(prev => ({
        ...prev,
        publisherId: value,
        newPublisherName: "",
        newPublisherAddress: "",
        newPublisherWebsite: ""
      }));
    }
  };

  const createNewAuthor = async () => {
    if (!formData.newAuthorName.trim()) return null;

    try {
      const newAuthor = await createAuthor({
        id: 0,
        fullName: formData.newAuthorName.trim(),
        biography: "",
        dateOfBirth: "2025-01-01T00:00:00Z"
      });

      setAuthors(prev => [...prev, newAuthor]);
      return newAuthor.id;
    } catch (e) {
      console.error("Failed to create author:", e);
      throw new Error("Failed to create author");
    }
  };

  const createNewPublisher = async () => {
    if (!formData.newPublisherName.trim()) return null;

    try {
      const newPublisher = await createPublisher({
        id: 0,
        name: formData.newPublisherName.trim(),
        address: formData.newPublisherAddress.trim() || "",
        website: formData.newPublisherWebsite.trim() || ""
      });

      setPublishers(prev => [...prev, newPublisher]);
      return newPublisher.id;
    } catch (e) {
      console.error("Failed to create publisher:", e);
      throw new Error("Failed to create publisher");
    }
  };

  const getMessageClass = (message) => {
    if (
      message.toLowerCase().includes("error") ||
      message.toLowerCase().includes("failed") ||
      message.toLowerCase().includes("required")
    ) {
      return "message error";
    }
    return "message success";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("Title is required!");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      let authorId = formData.authorId;
      let publisherId = formData.publisherId;

      if (showNewAuthor) {
        if (!formData.newAuthorName.trim()) {
          setMessage("Author name is required!");
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        authorId = await createNewAuthor();
      }

      if (showNewPublisher) {
        if (!formData.newPublisherName.trim()) {
          setMessage("Publisher name is required!");
          setLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        publisherId = await createNewPublisher();
      }

      if (!authorId || !publisherId) {
        setMessage("Author and Publisher are required!");
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const payload = {
        id: id ? parseInt(id, 10) : 0,
        title: formData.title.trim(),
        isbn: formData.isbn.trim() || "",
        publishedDate: formData.publicationDate ? `${formData.publicationDate}T00:00:00Z` : "2025-01-01T00:00:00Z",
        pageCount: formData.pages ? parseInt(formData.pages, 10) : 0,
        authorId: parseInt(authorId, 10),
        publisherId: parseInt(publisherId, 10),
      };

      if (id) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }

      navigate("/books");
    } catch (e) {
      console.error("Submit error:", e);
      setMessage(`Error ${id ? 'updating' : 'creating'} book. ${e.message || 'Please try again.'}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/books");
  };

  return (
    <div className="form-container">
      <h1 className="form-title">{id ? "✏️ Edit Book" : "➕ Create Book"}</h1>
      {message && (
        <div className={getMessageClass(message)}>
          {message}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              className="form-input"
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ISBN</label>
            <input
              className="form-input"
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publication Date</label>
            <input
              className="form-input"
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pages</label>
            <input
              className="form-input"
              type="number"
              name="pages"
              min="0"
              value={formData.pages}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <select
              className="form-select"
              value={showNewAuthor ? "new" : formData.authorId}
              onChange={handleAuthorChange}
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.id} value={String(a.id)}>{a.fullName}</option>
              ))}
              <option value="new">➕ Add New Author</option>
            </select>
          </div>

          {showNewAuthor && (
            <div className="form-group">
              <label className="form-label">New Author Name *</label>
              <input
                className="form-input"
                type="text"
                name="newAuthorName"
                placeholder="Enter author's full name"
                value={formData.newAuthorName}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Publisher *</label>
            <select
              className="form-select"
              value={showNewPublisher ? "new" : formData.publisherId}
              onChange={handlePublisherChange}
            >
              <option value="">Select publisher</option>
              {publishers.map((p) => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
              <option value="new">➕ Add New Publisher</option>
            </select>
          </div>

          {showNewPublisher && (
            <>
              <div className="form-group">
                <label className="form-label">New Publisher Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="newPublisherName"
                  placeholder="Enter publisher name"
                  value={formData.newPublisherName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Publisher Address</label>
                <input
                  className="form-input"
                  type="text"
                  name="newPublisherAddress"
                  placeholder="Enter publisher address"
                  value={formData.newPublisherAddress}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Publisher Website</label>
                <input
                  className="form-input"
                  type="url"
                  name="newPublisherWebsite"
                  placeholder="https://example.com"
                  value={formData.newPublisherWebsite}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Saving..." : (id ? "Update Book" : "Create Book")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;