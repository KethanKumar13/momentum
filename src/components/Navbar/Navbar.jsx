import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar fade-in">
      <div className="navbar__brand">
        <div className="navbar__logo">
          ✓
        </div>

        <div>
          <h2>TaskFlow</h2>
          <p>Task Management Dashboard</p>
        </div>
      </div>

      <nav className="navbar__links">
        <a href="#" className="active">
          Dashboard
        </a>

        <a href="#">
          Tasks
        </a>

        <a href="#">
          Analytics
        </a>
      </nav>

      <div className="navbar__profile">
        <button className="notification-btn">
          🔔
        </button>

        <div className="avatar">
          K
        </div>

        <div>
          <strong>Kethan</strong>
          <small>Software Developer</small>
        </div>
      </div>
    </header>
  );
}

export default Navbar;