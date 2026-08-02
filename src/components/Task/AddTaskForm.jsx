import { useRef, useState } from "react";

import Button from "../ui/Button";

const initialFormState = {
  title: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
};

function AddTaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialFormState);
  const [error, setError] = useState("");

  const titleInputRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

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
      assignedTo: formData.assignedTo.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: "Pending",
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
        marginBottom: "20px",
      }}
    >
      <h3 style={{ margin: 0 }}>Add New Task</h3>

      <label>
        <div style={{ marginBottom: "4px" }}>Task Name</div>

        <input
          ref={titleInputRef}
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task name"
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Assigned To</div>

        <input
          type="text"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          placeholder="Who is responsible?"
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Due Date</div>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        />
      </label>

      <label>
        <div style={{ marginBottom: "4px" }}>Priority</div>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "8px",
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      {error && (
        <p
          style={{
            color: "crimson",
            margin: 0,
          }}
        >
          {error}
        </p>
      )}

      <Button type="submit" variant="primary">
        + Create Task
      </Button>
    </form>
  );
}

export default AddTaskForm;