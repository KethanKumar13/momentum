import "./SearchBar.css";

function SearchBar({ searchTerm, onSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Search tasks..."
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;