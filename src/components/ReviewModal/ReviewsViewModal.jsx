import React, { useState, useEffect } from "react";
import { getReviewsByBookId } from "../../service/service.js";

const ReviewsViewModal = ({ book, isOpen, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && book) {
      fetchReviews();
    }
  }, [isOpen, book]);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await getReviewsByBookId(book.id);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("sr-RS", {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        {i < rating ? '⭐' : '☆'}
      </span>
    ));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="form-overlay" onClick={handleOverlayClick}>
      <div className="form-container reviews-view-modal">
        <h3 className="form-title">📖 Reviews for "{book?.title}"</h3>
        
        {error && <div className="message error">{error}</div>}
        
        <div className="book-info">
          <p><strong>Author:</strong> {book?.authorFullName || "Unknown"}</p>
          <p><strong>Average Rating:</strong> 
            <span className="book-rating">
              {book?.averageRating > 0 ? (
                <>
                  {renderStars(Math.round(book.averageRating))}
                  <span className="rating-number">({book.averageRating.toFixed(1)}/5)</span>
                </>
              ) : (
                <span className="no-rating">No ratings yet</span>
              )}
            </span>
          </p>
        </div>

        <div className="reviews-content">
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews">
              <p>📝 No reviews yet for this book.</p>
              <p>Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="reviews-list">
              <h4>📝 Reader Reviews ({reviews.length})</h4>
              {reviews.map((review, index) => (
                <div key={review.id || index} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">
                        👤 {review.userName || review.userFullName || "Anonymous"}
                      </span>
                      <span className="review-date">
                        🗓️ {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-text">({review.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="review-comment">
                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewsViewModal;