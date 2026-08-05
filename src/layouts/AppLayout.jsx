import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";
import { MobileTabBar } from "../components/layout/MobileTabBar";
import { CommandPalette } from "../components/layout/CommandPalette";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import styles from "./AppLayout.module.css";

export function AppLayout() {
  const [cmdOpen, setCmdOpen] = useState(false);

  const isMobile = useMediaQuery(
    "(max-width: 767px)"
  );

  useKeyboardShortcut(
    "mod+k",
    (event) => {
      event.preventDefault();
      setCmdOpen(true);
    }
  );

  return (
    <div className={styles.shell}>
      {/* Skip link */}
      <a
        href="#main-content"
        className={styles.skipLink}
      >
        Skip to main content
      </a>

      {/* Desktop sidebar */}
      {!isMobile && <Sidebar />}

      <div className={styles.content}>
        <Topbar
          onCommandPaletteOpen={() =>
            setCmdOpen(true)
          }
        />

        <main
          id="main-content"
          className={styles.main}
          style={{
            paddingBottom: isMobile
              ? 80
              : 0,
          }}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile navigation */}
      {isMobile && (
        <MobileTabBar
          onAddClick={() => {}}
        />
      )}

      {/* Command palette */}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
      />
    </div>
  );
}