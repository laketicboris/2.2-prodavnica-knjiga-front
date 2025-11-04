import React, { useEffect, useState } from "react";
import { 
  getAllBooks, 
  getBookSortTypes, 
  getFilteredAndSortedBooks,
  deleteBook,
  getAllAuthors 
} from "../service/service";
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
  
  // role će se čuvati uloga ulogovanog korisnika
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
    
    // useEffect će, pored fetchData() koja dobavlja sve knjige, preuzeti token iz localStorage
    // iz tokena će se izvući uloga i smestiti u role pomoću setRole
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
    const fetchBooks = async () => {
      try {
        setLoading(true);
        
        const hasFilters = Object.values(appliedFilters).some(value => value !== "");
        let data;
        
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
          
          data = await getFilteredAndSortedBooks(filterDto, selectedSortType);
        } else {
          data = await getAllBooks(selectedSortType);
        }
        
        setBooks(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Books fetch error:", e);
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
      setBooks(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      console.error("Delete error:", e);
      alert("Failed to delete book.");
    }
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

      <BooksList
        books={books}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Books;