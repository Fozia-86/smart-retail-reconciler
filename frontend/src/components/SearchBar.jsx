function SearchBar() {
  return (
    <div className="search-bar">

      <input
        type="text"
        placeholder="🔍 Search invoice or vendor..."
      />

      <button>Search</button>

    </div>
  );
}

export default SearchBar;