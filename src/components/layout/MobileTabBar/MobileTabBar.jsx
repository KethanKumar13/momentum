import { Plus } from "lucide-react";
import * as icons from "lucide-react";
import { NavLink } from "react-router-dom";
import { routes } from "../../../router/routes.config";
import styles from "./MobileTabBar.module.css";

export function MobileTabBar({ onAddClick }) {
  const tabRoutes = routes.filter(
    (route) => route.showInMobileTab
  );

  const half = Math.floor(tabRoutes.length / 2);
  const left = tabRoutes.slice(0, half);
  const right = tabRoutes.slice(half);

  return (
    <nav
      className={styles.tabbar}
      aria-label="Mobile navigation"
    >
      {left.map((route) => {
        const Icon = icons[route.icon];

        return (
          <TabItem
            key={route.path}
            route={route}
            Icon={Icon}
          />
        );
      })}

      {/* Centre FAB */}
      <button
        type="button"
        className={styles.fab}
        onClick={onAddClick}
        aria-label="Quick add"
      >
        <Plus size={22} />
      </button>

      {right.map((route) => {
        const Icon = icons[route.icon];

        return (
          <TabItem
            key={route.path}
            route={route}
            Icon={Icon}
          />
        );
      })}
    </nav>
  );
}

function TabItem({ route, Icon }) {
  return (
    <NavLink
      to={route.path}
      className={({ isActive }) =>
        [
          styles.tab,
          isActive ? styles.active : "",
        ]
          .filter(Boolean)
          .join(" ")
      }
      aria-label={route.label}
    >
      {Icon && (
        <Icon
          size={22}
          aria-hidden="true"
        />
      )}

      <span className={styles.tabLabel}>
        {route.label}
      </span>
    </NavLink>
  );
}