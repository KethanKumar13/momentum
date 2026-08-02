import DropdownOption from "./DropdownOption";

function DropdownMenu({
  options,
  selectedValue,
  onSelect,
}) {
  if (!options.length) {
    return (
      <div className="dropdown-empty">
        No options available
      </div>
    );
  }

  return (
    <div className="dropdown-menu">
      {options.map((option) => (
        <DropdownOption
          key={option.value}
          option={option}
          selected={
            selectedValue === option.value
          }
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default DropdownMenu;