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
    <article
      style={{
        border: "1px solid #dcdcdc",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "16px",
        backgroundColor: "#ffffff",
      }}
    >
      <h2>{title}</h2>

      <p>
        <strong>Assigned To:</strong> {assignedTo}
      </p>

      <p>
        <strong>Due Date:</strong> {dueDate}
      </p>

      <p>
        <strong>Priority:</strong> {priority}
      </p>

      <p>
        <strong>Status:</strong> {status}
      </p>

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={onToggleComplete}>
          {status === "Completed"
            ? "Mark as Pending"
            : "Mark as Completed"}
        </button>

        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;