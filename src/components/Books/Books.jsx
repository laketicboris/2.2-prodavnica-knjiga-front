import React, { useEffect, useState } from "react";
import { 
  getAllBooks, 
  getBookSortTypes, 
  getFilteredAndSortedBooks,
  deleteBook,
  getAllAuthors 
} from "../../service/service";
import BooksHeader from "./BooksHeader";
import BooksFilter from "./BooksFilter";
import BooksList from "./BooksList";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [sortTypes, setSortTypes] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedSortType, setSelectedSortType] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [role, setRole] = useState(null);

  const [filters, setFilters] = useState({
    title: "",
    publishedDateFrom: "",
    publishedDateTo: "",
    authorId: "",
    authorName: "",
    authorBirthDateFrom: "",
    authorBirthDateTo: ""
  });

  const [appliedFilters, setAppliedFilters] = useState({
    title: "",
    publishedDateFrom: "",
    publishedDateTo: "",
    authorId: "",
    authorName: "",
    authorBirthDateFrom: "",
    authorBirthDateTo: ""
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [sortTypesData, authorsData] = await Promise.all([
          getBookSortTypes(),
          getAllAuthors(1, 100)
        ]);
        setSortTypes(Array.isArray(sortTypesData) ? sortTypesData : []);
        const authorsList = authorsData?.items || [];
        setAuthors(Array.isArray(authorsList) ? authorsList : []);
      } catch (e) {
        console.error("Failed to fetch initial data:", e);
      }
    };

    fetchInitialData();

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role);
      } catch {
        console.error('Nevalidan token');
      }
    }
  }, []);

  const fetchBooks = async (page = currentPage) => {
    try {
      setLoading(true);
      setError("");

      const hasFilters = Object.values(appliedFilters).some(value => value !== "");

      let paged;
      if (hasFilters) {
        const filterDto = {
          title: appliedFilters.title || null,
          publishedDateFrom: appliedFilters.publishedDateFrom ? `${appliedFilters.publishedDateFrom}T00:00:00Z` : null,
          publishedDateTo: appliedFilters.publishedDateTo ? `${appliedFilters.publishedDateTo}T23:59:59Z` : null,
          authorId: appliedFilters.authorId ? parseInt(appliedFilters.authorId) : null,
          authorName: appliedFilters.authorName || null,
          authorBirthDateFrom: appliedFilters.authorBirthDateFrom ? `${appliedFilters.authorBirthDateFrom}T00:00:00Z` : null,
          authorBirthDateTo: appliedFilters.authorBirthDateTo ? `${appliedFilters.authorBirthDateTo}T23:59:59Z` : null
        };
        paged = await getFilteredAndSortedBooks(filterDto, selectedSortType, page, pageSize);
      } else {
        paged = await getAllBooks(selectedSortType, page, pageSize);
      }

      setBooks(Array.isArray(paged?.data) ? paged.data : []);
      setCurrentPage(paged?.currentPage || page);
      setTotalPages(paged?.totalPages || 0);
      setTotalCount(paged?.totalCount || 0);
    } catch (e) {
      console.error("Books fetch error:", e);
      setError("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSortType, appliedFilters]);

  useEffect(() => {
    fetchBooks(1);
  }, [selectedSortType, appliedFilters]);

  const handleSortChange = (e) => {
    setSelectedSortType(parseInt(e.target.value, 10));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      title: "",
      publishedDateFrom: "",
      publishedDateTo: "",
      authorId: "",
      authorName: "",
      authorBirthDateFrom: "",
      authorBirthDateTo: ""
    };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      await deleteBook(id);
      fetchBooks(currentPage);
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete book.");
    }
  };

  const handleReviewCreated = () => {
    fetchBooks(currentPage);
  };

  const goToPage = (p) => {
    if (p < 1 || (totalPages && p > totalPages)) return;
    setCurrentPage(p);
    fetchBooks(p);
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">Loading books...</div>
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
      <BooksHeader
        sortTypes={sortTypes}
        selectedSortType={selectedSortType}
        onSortChange={handleSortChange}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />

      {showFilters && (
        <BooksFilter
          filters={filters}
          authors={authors}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      )}

      <div className="results-header">
        <span>
          Found {totalCount} book(s) — Page {currentPage} of {totalPages || 1}
        </span>
      </div>

      <BooksList
        books={books}
        currentPage={currentPage}
        pageSize={pageSize}
        onDelete={handleDelete}
        onReviewCreated={handleReviewCreated}
      />

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages} · {totalCount} total
          </span>

          <button
            className="pagination-btn"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Books;
