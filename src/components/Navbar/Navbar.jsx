import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__logo">
        <span className="logo-icon">✓</span>
        <h1>TaskFlow</h1>
      </div>

      <div className="navbar__right">
        <button className="notification-btn">🔔</button>

        <div className="user-profile">
          <div className="avatar">K</div>

          <div>
            <h4>Kethan</h4>
            <p>Software Developer</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;