import useLocalStorage from "./useLocalStorage";
import { STORAGE_KEYS } from "../utils/storage";

const initialTasks = [
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
];

function useTasks() {
  const [tasks, setTasks] = useLocalStorage(
    STORAGE_KEYS.TASKS,
    initialTasks
  );

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

  return {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
  };
}

export default useTasks;