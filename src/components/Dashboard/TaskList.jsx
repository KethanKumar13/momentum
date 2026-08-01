import TaskCard from "../TaskCard/TaskCard";

function TaskList({ tasks, onDelete, onToggleComplete }) {
  return (
    <section>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          assignedTo={task.assignedTo}
          dueDate={task.dueDate}
          priority={task.priority}
          status={task.status}
          onDelete={() => onDelete(task.id)}
          onToggleComplete={() => onToggleComplete(task.id)}
        />
      ))}
    </section>
  );
}

export default TaskList;