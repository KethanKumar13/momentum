import { useMemo, useState } from "react";

import "./Dashboard.css";

import DashboardHeader from "./DashboardHeader";
import TaskStats from "./TaskStats";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import TaskList from "./TaskList";

import AddTaskForm from "../Task/AddTaskForm";

import useTasks from "../../hooks/useTasks";

function Dashboard() {
  // ==========================================
  // Task Hook
  // ==========================================

  const {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
  } = useTasks();

  // ==========================================
  // UI State
  // ==========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

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
  // Filter + Sort
  // ==========================================

  const filteredTasks = useMemo(() => {
    return [...tasks]
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
  }, [
    tasks,
    searchTerm,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  return (
    <main className="dashboard">
      <DashboardHeader />

      <TaskStats
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        highPriorityTasks={highPriorityTasks}
      />

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <AddTaskForm onAddTask={addTask} />
        </div>

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