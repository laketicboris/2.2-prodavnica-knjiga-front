import React, { useState } from "react";
import { createReview } from "../../service/service.js";

const ReviewModal = ({ book, isOpen, onClose, onReviewCreated }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      setError("Please enter a comment for your review.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reviewData = {
        bookId: book.id,
        rating: parseInt(formData.rating),
        comment: formData.comment.trim()
      };

      await createReview(reviewData);
      
      setFormData({ rating: 5, comment: "" });
      onReviewCreated();
      onClose();
      
    } catch (err) {
      console.error("Review creation error:", err);
      setError("Failed to create review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ rating: 5, comment: "" });
    setError("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={handleOverlayClick}>
      <div className="form-container review-modal">
        <h3 className="form-title">⭐ Write a Review</h3>
        
        {error && <div className="message error">{error}</div>}
        
        <div className="book-preview">
          <h4>Book Details:</h4>
          <p><strong>Title:</strong> {book.title}</p>
          <p><strong>Author:</strong> {book.authorFullName || "Unknown"}</p>
          {book.publishedDate && (
            <p><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString("sr-RS")}</p>
          )}
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Rating *</label>
              <div className="rating-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                  >
                    {formData.rating >= star ? '⭐' : '☆'}
                  </button>
                ))}
                <span className="rating-text">({formData.rating}/5)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review *</label>
              <textarea
                className="form-input review-textarea"
                name="comment"
                placeholder="Share your thoughts about this book..."
                value={formData.comment}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

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
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? "Publishing..." : "📝 Publish Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;