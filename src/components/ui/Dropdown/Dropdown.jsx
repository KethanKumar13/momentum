import { ChevronDown } from "lucide-react";

import "./Dropdown.css";

import DropdownMenu from "./DropdownMenu";
import useDropdown from "./useDropdown";

function Dropdown({
  options = [],
  value = "",
  onChange,
  placeholder = "Select...",
  disabled = false,
}) {
  const {
    isOpen,
    toggleDropdown,
    closeDropdown,
    dropdownRef,
  } = useDropdown();

  const selectedOption = options.find(
    (option) => option.value === value
  );

  const handleSelect = (option) => {
    onChange(option.value);

    closeDropdown();
  };

  return (
    <div
      className={`dropdown ${
        disabled ? "disabled" : ""
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="dropdown-trigger"
        onClick={toggleDropdown}
        disabled={disabled}
      >
        <span className="dropdown-value">
          {selectedOption
            ? selectedOption.label
            : placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`dropdown-arrow ${
            isOpen ? "open" : ""
          }`}
        />
      </button>

      {isOpen && (
        <DropdownMenu
          options={options}
          selectedValue={value}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}

export default Dropdown;