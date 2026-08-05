import { NavLink } from "react-router-dom";
import { cn } from "../../lib/cn";
import styles from "./NavItem.module.css";

export function NavItem({
  path,
  label,
  icon: Icon,
  collapsed = false,
  onClick,
}) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          styles.item,
          isActive && styles.active,
          collapsed && styles.collapsed
        )
      }
      title={collapsed ? label : undefined}
    >
      {Icon && (
        <Icon
          size={20}
          aria-hidden="true"
        />
      )}

      {!collapsed && (
        <span className={styles.label}>
          {label}
        </span>
      )}
    </NavLink>
  );
}