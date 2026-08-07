import { Link, Outlet } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import { ThemeToggle } from "../components/layout/ThemeToggle";
import { Button } from "../components/ui/Button";
import styles from "./PublicLayout.module.css";

export function PublicLayout() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link
          to="/"
          aria-label="Momentum home"
        >
          <Logo />
        </Link>

        <nav
          className={styles.nav}
          aria-label="Public navigation"
        >
          <ThemeToggle />

          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
            >
              Sign in
            </Button>
          </Link>

          <Link to="/signup">
            <Button size="sm">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}