function SearchBar() {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search invoices..."
      />

      <button>Search</button>
    </div>
  );
}

export default SearchBar;