import { useRef, useState } from "react";

import "./AddTaskForm.css";

import Button from "../ui/Button";

const initialForm = {
  title: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
};

function AddTaskForm({ onAddTask }) {
  const [formData, setFormData] =
    useState(initialForm);

  const [error, setError] =
    useState("");

  const titleRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");

      titleRef.current.focus();

      return;
    }

    onAddTask(formData);

    setFormData(initialForm);

    titleRef.current.focus();
  }

  return (
    <form
      className="add-task-form"
      onSubmit={handleSubmit}
    >
      <h2>Create New Task</h2>

      <label>

        Task Name

        <input
          ref={titleRef}
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task name"
        />

      </label>

      <label>

        Assigned To

        <input
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          placeholder="Developer name"
        />

      </label>

      <label>

        Due Date

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

      </label>

      <label>

        Priority

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

      </label>

      {error && (
        <p className="form-error">
          {error}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
      >
        + Create Task
      </Button>

    </form>
  );
}

export default AddTaskForm;