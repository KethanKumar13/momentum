import "./TaskStats.css";

function TaskStats({
  totalTasks,
  completedTasks,
  pendingTasks,
  highPriorityTasks,
}) {
  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: "📋",
      color: "#3b82f6",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: "🟡",
      color: "#f59e0b",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: "🟢",
      color: "#22c55e",
    },
    {
      title: "High Priority",
      value: highPriorityTasks,
      icon: "🔥",
      color: "#ef4444",
    },
  ];

  return (
    <section className="stats-section">

      <div className="stats-header">
        <h2>Dashboard Overview</h2>
        <p>Manage your daily work efficiently</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
            style={{
              borderTop: `5px solid ${stat.color}`,
            }}
          >
            <div className="stat-icon">
              {stat.icon}
            </div>

            <h3>{stat.title}</h3>

            <h1>{stat.value}</h1>
          </div>
        ))}
      </div>

    </section>
  );
}

export default TaskStats;