import {
  ClipboardList,
  Clock3,
  CircleCheckBig,
  TriangleAlert,
  ArrowUpRight,
} from "lucide-react";

import "./TaskStats.css";

function TaskStats({
  totalTasks,
  pendingTasks,
  completedTasks,
  highPriorityTasks,
}) {
  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: <ClipboardList size={30} />,
      color: "primary",
      subtitle: "All active tasks",
    },
    {
      title: "Pending",
      value: pendingTasks,
      icon: <Clock3 size={30} />,
      color: "warning",
      subtitle: "Needs attention",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: <CircleCheckBig size={30} />,
      color: "success",
      subtitle: "Finished tasks",
    },
    {
      title: "High Priority",
      value: highPriorityTasks,
      icon: <TriangleAlert size={30} />,
      color: "danger",
      subtitle: "Urgent work",
    },
  ];

  return (
    <section className="task-stats fade-in">
      <div className="task-stats-header">
        <h2>Dashboard Overview</h2>
        <p>Manage your daily work efficiently</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className={`stat-card ${stat.color}`}
          >
            <div className="stat-top">
              <div className="stat-icon">
                {stat.icon}
              </div>

              <div className="stat-trend">
                <ArrowUpRight size={16} />
              </div>
            </div>

            <h4>{stat.title}</h4>

            <h2>{stat.value}</h2>

            <p>{stat.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TaskStats;