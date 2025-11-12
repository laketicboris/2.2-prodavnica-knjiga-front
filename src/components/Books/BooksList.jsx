import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserHasReviewed } from "../../service/service.js";
import UserContext from "../../components/User/UserContext.jsx";
import ReviewModal from "../ReviewModal/ReviewModal.jsx";
import ReviewsViewModal from "../ReviewModal/ReviewsViewModal.jsx";

const BooksList = ({ books, currentPage = 1, pageSize = 10, onDelete, onReviewCreated }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [role, setRole] = useState(null);

  const [selectedBook, setSelectedBook] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [selectedBookForView, setSelectedBookForView] = useState(null);
  const [showViewReviewsModal, setShowViewReviewsModal] = useState(false);

  const [userReviewedBooks, setUserReviewedBooks] = useState(new Set());

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

  useEffect(() => {
    if (user && books.length > 0) {
      checkExistingReviews();
    }
  }, [user, books]);

  const checkExistingReviews = async () => {
    try {
      const reviewPromises = books.map(book => checkUserHasReviewed(book.id));
      const reviewResults = await Promise.all(reviewPromises);

      const reviewedSet = new Set();
      reviewResults.forEach((hasReviewed, index) => {
        if (hasReviewed) {
          reviewedSet.add(books[index].id);
        }
      });

      setUserReviewedBooks(reviewedSet);
    } catch (err) {
      console.error("Error checking user reviews:", err);
    }
  };

  const handleOpenReviewModal = (book) => {
    setSelectedBook(book);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedBook(null);
    setShowReviewModal(false);
  };

  const handleViewReviews = (book) => {
    setSelectedBookForView(book);
    setShowViewReviewsModal(true);
  };

  const handleCloseViewReviews = () => {
    setSelectedBookForView(null);
    setShowViewReviewsModal(false);
  };

  const handleReviewCreated = () => {
    checkExistingReviews();
    if (onReviewCreated) {
      onReviewCreated();
    }
  };

  if (books.length === 0) {
    return <div className="no-data">No books found matching the criteria.</div>;
  }

  return (
    <>
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
            <th className="rating-column">Rating</th>
            {user && (
              <>
                <th className="actions-column">Review</th>
                <th className="actions-column">View Reviews</th>
              </>
            )}
            {role === "Editor" && (
              <>
                <th className="actions-column">Edit</th>
                <th className="actions-column">Delete</th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {books.map((book, index) => {
            const hasUserReviewed = userReviewedBooks.has(book.id);
            const ordinal = (currentPage - 1) * pageSize + index + 1;

            return (
              <tr key={book.id}>
                <td className="number-column">{ordinal}</td>
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
                <td className="rating-column">
                  {book.averageRating > 0 ? (
                    <button
                      className="rating-display clickable-rating"
                      onClick={() => handleViewReviews(book)}
                      title="Click to view reviews"
                    >
                      ⭐ {book.averageRating.toFixed(1)}
                    </button>
                  ) : (
                    <span className="no-rating">No ratings</span>
                  )}
                </td>
                {user && (
                  <>
                    <td className="actions-column">
                      {hasUserReviewed ? (
                        <button
                          className="btn-review disabled"
                          disabled
                          title="You have already reviewed this book"
                        >
                          ✓ Reviewed
                        </button>
                      ) : (
                        <button
                          className="btn-review"
                          onClick={() => handleOpenReviewModal(book)}
                          title="Write a review"
                        >
                          ⭐ Review
                        </button>
                      )}
                    </td>
                    <td className="actions-column">
                      <button
                        className="btn-view-reviews"
                        onClick={() => handleViewReviews(book)}
                        title="View all reviews"
                      >
                        📖 Reviews
                      </button>
                    </td>
                  </>
                )}
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
            );
          })}
        </tbody>
      </table>

      <ReviewModal
        book={selectedBook}
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        onReviewCreated={handleReviewCreated}
      />

      <ReviewsViewModal
        book={selectedBookForView}
        isOpen={showViewReviewsModal}
        onClose={handleCloseViewReviews}
      />
    </>
  );
};

export default BooksList;
