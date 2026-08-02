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
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
      >
        <option value="All">
          All Status
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="Completed">
          Completed
        </option>
      </select>

      <select
        value={priorityFilter}
        onChange={(event) =>
          onPriorityChange(event.target.value)
        }
      >
        <option value="All">
          All Priority
        </option>

        <option value="High">
          High
        </option>

        <option value="Medium">
          Medium
        </option>

        <option value="Low">
          Low
        </option>
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          onSortChange(event.target.value)
        }
      >
        <option value="Newest">
          Newest
        </option>

        <option value="Oldest">
          Oldest
        </option>

        <option value="Priority">
          Priority
        </option>

        <option value="Due Date">
          Due Date
        </option>
      </select>

    </div>
  );
}

export default FilterBar;