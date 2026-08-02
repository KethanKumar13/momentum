import "./TaskCard.css";

import Button from "../ui/Button";

function TaskCard({
  title,
  assignedTo,
  dueDate,
  priority,
  status,
  onDelete,
  onToggleComplete,
}) {
  return (
    <article className="task-card">

      <div className="task-card-header">

        <h2>{title}</h2>

        <span
          className={`priority-badge ${priority.toLowerCase()}`}
        >
          {priority}
        </span>

      </div>

      <div className="task-details">

        <p>

          <strong>Assigned To</strong>

          <span>{assignedTo || "-"}</span>

        </p>

        <p>

          <strong>Due Date</strong>

          <span>{dueDate || "-"}</span>

        </p>

        <p>

          <strong>Status</strong>

          <span
            className={`status ${status.toLowerCase()}`}
          >
            {status}
          </span>

        </p>

      </div>

      <div className="task-actions">

        <Button
          variant={
            status === "Completed"
              ? "secondary"
              : "success"
          }
          onClick={onToggleComplete}
        >
          {status === "Completed"
            ? "Mark Pending"
            : "Complete"}
        </Button>

        <Button
          variant="danger"
          onClick={onDelete}
        >
          Delete
        </Button>

      </div>

    </article>
  );
}

export default TaskCard;