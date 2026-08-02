import {
  CalendarDays,
  Target,
  TrendingUp,
} from "lucide-react";

import "./DashboardHeader.css";

function DashboardHeader() {
  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <section className="dashboard-header fade-in">

      <div className="dashboard-left-content">

        <span className="dashboard-tag">
          Productivity Dashboard
        </span>

        <h1>
          Welcome back,
          <span> Kethan 👋</span>
        </h1>

        <p>
          Stay focused and keep your work
          organized with TaskFlow.
        </p>

      </div>

      <div className="dashboard-right-content">

        <div className="dashboard-info-card">

          <CalendarDays size={22} />

          <div>

            <small>Today</small>

            <strong>{today}</strong>

          </div>

        </div>

        <div className="dashboard-info-card">

          <Target size={22} />

          <div>

            <small>Today&apos;s Goal</small>

            <strong>Complete 5 Tasks</strong>

          </div>

        </div>

        <div className="dashboard-info-card">

          <TrendingUp size={22} />

          <div>

            <small>Productivity</small>

            <strong>92%</strong>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardHeader;