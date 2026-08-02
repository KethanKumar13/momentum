function DropdownOption({
  option,
  selected,
  onSelect,
}) {
  const handleClick = () => {
    if (option.disabled) return;

    onSelect(option);
  };

  return (
    <button
      type="button"
      className={`dropdown-option ${
        selected ? "selected" : ""
      } ${option.disabled ? "disabled" : ""}`}
      onClick={handleClick}
      disabled={option.disabled}
    >
      {option.icon && (
        <span className="dropdown-option-icon">
          {option.icon}
        </span>
      )}

      <span className="dropdown-option-label">
        {option.label}
      </span>
    </button>
  );
}

export default DropdownOption;