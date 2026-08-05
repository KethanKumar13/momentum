import { useEffect, useRef } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import * as icons from "lucide-react";
import { X } from "lucide-react";
import { routes } from "../../../router/routes.config";
import styles from "./CommandPalette.module.css";

export function CommandPalette({
  open,
  onClose,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [open]);

  useEffect(() => {
    function handler(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handler
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handler
      );
    };
  }, [onClose]);

  if (!open) {
    return null;
  }

  function handleSelect(path) {
    navigate(path);
    onClose();
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Command palette"
    >
      <div className={styles.panel}>
        <Command
          className={styles.command}
          shouldFilter
        >
          <div className={styles.inputRow}>
            <Command.Input
              ref={inputRef}
              placeholder="Search pages..."
              className={styles.input}
            />

            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>
              No results found.
            </Command.Empty>

            <Command.Group
              heading="Navigate"
              className={styles.group}
            >
              {routes.map((route) => {
                const Icon = icons[route.icon];

                return (
                  <Command.Item
                    key={route.path}
                    value={route.label}
                    onSelect={() =>
                      handleSelect(route.path)
                    }
                    className={styles.item}
                  >
                    {Icon && (
                      <Icon
                        size={16}
                        aria-hidden="true"
                      />
                    )}

                    <span>
                      {route.label}
                    </span>

                    <span className={styles.path}>
                      {route.path}
                    </span>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}