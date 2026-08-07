import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as icons from "lucide-react";
import { routes } from "../../../router/routes.config";
import { NavItem } from "../../navigation/NavItem";
import { UserMenu } from "../../navigation/UserMenu";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={styles.sidebar}
      style={{ width: collapsed ? 68 : 240 }}
      aria-label="Primary navigation"
    >
      {/* Logo */}
      <div className={styles.logoRow}>
        <Logo collapsed={collapsed} />

        <button
          type="button"
          className={styles.collapseBtn}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {routes
          .filter((route) => route.showInSidebar)
          .map((route) => {
            const Icon = icons[route.icon];

            return (
              <NavItem
                key={route.path}
                path={route.path}
                label={route.label}
                icon={Icon}
                collapsed={collapsed}
              />
            );
          })}
      </nav>

      {/* Bottom actions */}
      <div className={styles.bottom}>
        {!collapsed && <ThemeToggle />}
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}