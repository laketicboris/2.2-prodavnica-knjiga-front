import React from "react";

const BooksFilter = ({ filters, authors, onFilterChange, onApplyFilters, onResetFilters }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        <div className="filter-group">
          <label>Book Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Search by title..."
            value={filters.title}
            onChange={onFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Published From:</label>
          <input
            type="date"
            name="publishedDateFrom"
            max={today}
            value={filters.publishedDateFrom}
            onChange={onFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Published To:</label>
          <input
            type="date"
            name="publishedDateTo"
            max={today}
            value={filters.publishedDateTo}
            onChange={onFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Author (Select):</label>
          <select
            name="authorId"
            value={filters.authorId}
            onChange={onFilterChange}
          >
            <option value="">All Authors</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Author Name:</label>
          <input
            type="text"
            name="authorName"
            placeholder="Search by author name..."
            value={filters.authorName}
            onChange={onFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Author Birth From:</label>
          <input
            type="date"
            name="authorBirthDateFrom"
            max={today}
            value={filters.authorBirthDateFrom}
            onChange={onFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Author Birth To:</label>
          <input
            type="date"
            name="authorBirthDateTo"
            max={today}
            value={filters.authorBirthDateTo}
            onChange={onFilterChange}
          />
        </div>
      </div>

      <div className="filter-buttons">
        <button className="btn-apply" onClick={onApplyFilters}>
          🔍 Apply Filters
        </button>
        <button className="btn-reset" onClick={onResetFilters}>
          🔄 Reset Filters
        </button>
      </div>
    </div>
  );
};

export default BooksFilter;