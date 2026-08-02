import SearchInput from "../ui/SearchInput";

function SearchBar({
  searchTerm,
  onSearch,
}) {
  return (
    <SearchInput
      value={searchTerm}
      onChange={onSearch}
      placeholder="Search tasks..."
    />
  );
}

export default SearchBar;