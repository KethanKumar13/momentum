import "./FilterBar.css";

function FilterBar({
  statusFilter,
  priorityFilter,
  sortBy,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}) {
  return (
    <div className="filter-bar">

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priorityFilter}
        onChange={(e) => onPriorityChange(e.target.value)}
      >
        <option value="All">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="Newest">Newest</option>
        <option value="Oldest">Oldest</option>
        <option value="Priority">Priority</option>
        <option value="DueDate">Due Date</option>
      </select>

    </div>
  );
}

export default FilterBar;