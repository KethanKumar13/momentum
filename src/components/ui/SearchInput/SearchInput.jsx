import { Search, X } from "lucide-react";

import "./SearchInput.css";

function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  loading = false,
}) {
  function handleClear() {
    onChange("");
  }

  return (
    <div className="search-input-container">

      <Search
        size={18}
        className="search-input-icon"
      />

      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
      />

      {loading && (
        <div className="search-loader" />
      )}

      {!loading && value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
        >
          <X size={16} />
        </button>
      )}

    </div>
  );
}

export default SearchInput;