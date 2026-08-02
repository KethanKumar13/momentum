import { useEffect, useMemo, useRef, useState } from "react";

export default function useDropdown({
  options = [],
  value,
  searchable = false,
  onChange,
}) {
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    const query = search.trim().toLowerCase();

    if (!query) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, search, searchable]);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);

      if (searchable) {
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const openDropdown = () => setIsOpen(true);

  const closeDropdown = () => {
    setIsOpen(false);
    setSearch("");
  };

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const selectOption = (option) => {
    if (option.disabled) return;

    onChange(option.value);

    closeDropdown();
  };

  return {
    isOpen,
    openDropdown,
    closeDropdown,
    toggleDropdown,

    dropdownRef,
    triggerRef,
    searchInputRef,

    search,
    setSearch,

    highlightedIndex,
    setHighlightedIndex,

    filteredOptions,

    selectOption,
  };
}