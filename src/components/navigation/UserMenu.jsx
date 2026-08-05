import { useRef, useState } from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { Avatar } from "../ui/Avatar";
import styles from "./UserMenu.module.css";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function UserMenu({ collapsed = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  const items = [
    {
      icon: User,
      label: "Profile",
      onClick: () => {},
    },
    {
      icon: Settings,
      label: "Settings",
      onClick: () => {},
    },
    {
      icon: LogOut,
      label: "Sign out",
      onClick: () => {},
      danger: true,
    },
  ];

  return (
    <div
      ref={ref}
      className={styles.wrapper}
    >
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open user menu"
        aria-expanded={open}
      >
        <Avatar
          name="Kethan Kumar"
          size="sm"
        />

        {!collapsed && (
          <div className={styles.info}>
            <span className={styles.name}>
              Kethan Kumar
            </span>

            <span className={styles.email}>
              kethan@momentum.app
            </span>
          </div>
        )}
      </button>

      {open && (
        <div
          className={styles.menu}
          role="menu"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={cn(
                styles.menuItem,
                item.danger && styles.danger
              )}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              <item.icon
                size={15}
                aria-hidden="true"
              />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}