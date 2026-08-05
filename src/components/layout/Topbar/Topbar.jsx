import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { routes } from "../../../router/routes.config";
import { ThemeToggle } from "../ThemeToggle";
import { UserMenu } from "../../navigation/UserMenu";
import styles from "./Topbar.module.css";

export function Topbar({ onCommandPaletteOpen }) {
  const { pathname } = useLocation();

  const current = routes.find(
    (route) => route.path === pathname
  );

  const title = current?.label ?? "Momentum";

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>
        {title}
      </h1>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.searchBtn}
          onClick={onCommandPaletteOpen}
          aria-label="Open command palette"
        >
          <Search
            size={15}
            aria-hidden="true"
          />

          <span>Search</span>

          <kbd className={styles.kbd}>
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <UserMenu collapsed />
      </div>
    </header>
  );
}