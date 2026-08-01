import { useState, useRef } from "react";

const initialFormState = {
  title: "",
  assignee: "",
  dueDate: "",
  priority: "Medium"
};

function AddTaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");
  const titleInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title" && error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      setError("Task title is required.");
      titleInputRef.current?.focus();
      return;
    }

    onAddTask({
      title: trimmedTitle,
      assignee: formData.assignee.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: "Pending"
    });

    setFormData(initialFormState);
    setError("");
    titleInputRef.current?.focus();
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "20px"
      }}
    >
      <h3 style={{ margin: 0 }}>Add New Task</h3>

      <label>
        <div style={{ marginBottom: "4px" }}>Task Name</div>
        <input
          ref={titleInputRef}
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task name"
          style={{ width: "100%", padding: "8px" }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Assigned To</div>
        <input
          name="assignee"
          type="text"
          value={formData.assignee}
          onChange={handleChange}
          placeholder="Who is responsible?"
          style={{ width: "100%", padding: "8px" }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Due Date</div>
        <input
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Priority</div>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
