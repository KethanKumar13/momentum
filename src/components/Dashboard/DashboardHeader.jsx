import "./DashboardHeader.css";

function DashboardHeader() {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="dashboard-header fade-in">
      <div>
        <h1>Good Morning, Kethan 👋</h1>

        <p>
          Stay organized and keep track of your daily tasks.
        </p>
      </div>

      <div className="dashboard-date">
        {formattedDate}
      </div>
    </section>
  );
}

export default DashboardHeader;