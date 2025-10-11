import React from "react";

const BooksHeader = ({ sortTypes, selectedSortType, onSortChange, onToggleFilters, showFilters }) => {
  return (
    <div className="table-header">
      <h2 className="page-title">📖 Books</h2>
      
      <div className="header-controls">
        <div className="sort-container">
          <label className="sort-label" htmlFor="sortType">Sort by:</label>
          <select
            id="sortType"
            className="sort-select"
            value={selectedSortType}
            onChange={onSortChange}
          >
            {sortTypes.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="btn-filter-toggle"
          onClick={onToggleFilters}
        >
          {showFilters ? '🔼 Hide Filters' : '🔽 Show Filters'}
        </button>
      </div>
    </div>
  );
};

export default BooksHeader;