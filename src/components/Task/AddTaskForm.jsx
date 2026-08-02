import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Flag,
  Plus,
  User,
} from "lucide-react";

import Button from "../ui/Button";
import "./AddTaskForm.css";

const initialFormState = {
  title: "",
  assignedTo: "",
  dueDate: "",
  priority: "Medium",
};

function AddTaskForm({ onAddTask }) {
  const [formData, setFormData] =
    useState(initialFormState);

  const [error, setError] =
    useState("");

  const titleInputRef = useRef(null);

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

  function clearForm() {
    setFormData(initialFormState);
    setError("");

    titleInputRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle =
      formData.title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");

      titleInputRef.current?.focus();

      return;
    }

    onAddTask({
      title: trimmedTitle,
      assignedTo:
        formData.assignedTo.trim(),
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: "Pending",
    });

    clearForm();
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        clearForm();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  return (
    <section className="task-form-card">

      <div className="task-form-header">

        <h2>Add New Task</h2>

        <p>
          Organize your work efficiently
        </p>

      </div>

      <form
        className="task-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >

        <div className="form-group">

          <label htmlFor="title">
            Task Name
          </label>

          <div className="input-wrapper">

            <Plus size={18} />

            <input
              ref={titleInputRef}
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task name"
              required
            />

          </div>

        </div>

        <div className="form-group">

          <label htmlFor="assignedTo">
            Assigned To
          </label>

          <div className="input-wrapper">

            <User size={18} />

            <input
              id="assignedTo"
              type="text"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Who is responsible?"
            />

          </div>

        </div>

        <div className="form-group">

          <label htmlFor="dueDate">
            Due Date
          </label>

          <div className="input-wrapper">

            <CalendarDays size={18} />

            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="form-group">

          <label htmlFor="priority">
            Priority
          </label>

          <div className="input-wrapper">

            <Flag size={18} />

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
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

          </div>

        </div>

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

    </section>
  );
}

export default AddTaskForm;