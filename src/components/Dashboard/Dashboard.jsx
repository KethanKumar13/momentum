import { useState } from "react";

import "./Dashboard.css";

import AddTaskForm from "./AddTaskForm";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import TaskStats from "./TaskStats";
import TaskList from "./TaskList";

function Dashboard() {
  // ==========================================
  // Task State
  // ==========================================

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Learn React",
      assignedTo: "Kethan",
      dueDate: "2026-08-05",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Learn Git",
      assignedTo: "Kethan",
      dueDate: "2026-08-08",
      priority: "Medium",
      status: "Completed",
    },
    {
      id: 3,
      title: "Learn Docker",
      assignedTo: "John",
      dueDate: "2026-08-12",
      priority: "Low",
      status: "Pending",
    },
  ]);

  // ==========================================
  // Search / Filter / Sort State
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] = useState("All");

  const [sortBy, setSortBy] = useState("Newest");

  // ==========================================
  // Dashboard Statistics
  // ==========================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  ).length;

  // ==========================================
  // Derived State
  // ==========================================

  const filteredTasks = [...tasks]
    .filter((task) =>
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((task) =>
      statusFilter === "All"
        ? true
        : task.status === statusFilter
    )
    .filter((task) =>
      priorityFilter === "All"
        ? true
        : task.priority === priorityFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "Oldest":
          return a.id - b.id;

        case "Priority": {
          const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
          };

          return (
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
          );
        }

        case "DueDate":
          return (
            new Date(a.dueDate) -
            new Date(b.dueDate)
          );

        default:
          return b.id - a.id;
      }
    });

  // ==========================================
  // Task Actions
  // ==========================================

  function addTask(taskData) {
    const nextId =
      Math.max(...tasks.map((task) => task.id), 0) + 1;

    const newTask = {
      id: nextId,
      ...taskData,
      status: "Pending",
    };

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ]);
  }

  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  function toggleComplete(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : task
      )
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="dashboard">
      <TaskStats
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        highPriorityTasks={highPriorityTasks}
      />

      <div className="dashboard-grid">
        {/* Left Side */}

        <div className="dashboard-left">
          <AddTaskForm onAddTask={addTask} />
        </div>

        {/* Right Side */}

        <div className="dashboard-right">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />

          <FilterBar
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
            onSortChange={setSortBy}
          />

          <TaskList
            tasks={filteredTasks}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
          />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;