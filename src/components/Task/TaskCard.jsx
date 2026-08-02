import {
  CalendarDays,
  User,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import "./TaskCard.css";

function TaskCard({
  title,
  assignedTo,
  dueDate,
  priority,
  status,
  onDelete,
  onToggleComplete,
}) {
  const priorityClass = priority.toLowerCase();
  const statusClass = status.toLowerCase();

  return (
    <article className="task-card fade-in">

      <div className="task-card-header">

        <h3>{title}</h3>

        <span className={`priority-badge ${priorityClass}`}>
          {priority}
        </span>

      </div>

      <div className="task-card-body">

        <div className="task-info">

          <User size={16} />

          <span>{assignedTo || "Unassigned"}</span>

        </div>

        <div className="task-info">

          <CalendarDays size={16} />

          <span>{dueDate || "No Due Date"}</span>

        </div>

      </div>

      <div className="task-card-footer">

        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>

        <div className="task-actions">

          <button
            className="complete-btn"
            onClick={onToggleComplete}
          >
            <CheckCircle2 size={18} />

            {status === "Completed"
              ? "Undo"
              : "Complete"}
          </button>

          <button
            className="delete-btn"
            onClick={onDelete}
          >
            <Trash2 size={18} />

            Delete
          </button>

        </div>

      </div>

    </article>
  );
}

export default TaskCard;