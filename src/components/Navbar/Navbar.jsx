import {
  Bell,
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  CheckCircle2,
} from "lucide-react";

import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">
          <CheckCircle2 size={28} />
        </div>

        <div>
          <h1>TaskFlow</h1>
          <p>Task Management Dashboard</p>
        </div>
      </div>

      <nav className="navbar-links">
        <a href="#" className="active">
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a href="#">
          <CheckSquare size={18} />
          Tasks
        </a>

        <a href="#">
          <BarChart3 size={18} />
          Analytics
        </a>
      </nav>

      <div className="navbar-right">
        <button className="notification-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-avatar">
          K
        </div>

        <div className="user-info">
          <h4>Kethan</h4>
          <p>Software Developer</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;