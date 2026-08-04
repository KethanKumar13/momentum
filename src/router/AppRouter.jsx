import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { UIShowcasePage } from "../pages/dev/UIShowcasePage";

function TempHome() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "var(--sp-6)",
        background: "var(--grad-hero), var(--bg-base)",
      }}
    >
      <section className="u-container u-stack-lg u-text-center">
        <p className="t-micro">
          Week 1 Â· Day 3
        </p>

        <h1 className="t-display-lg t-gradient">
          Momentum
        </h1>

        <p className="t-body u-text-secondary">
          UI library complete. Visit{" "}
          <a
            href="/dev/ui"
            style={{
              color: "var(--brand-500)",
              textDecoration: "underline",
            }}
          >
            /dev/ui
          </a>{" "}
          to see all primitives.
        </p>
      </section>
    </main>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<TempHome />}
        />

        <Route
          path="/dev/ui"
          element={<UIShowcasePage />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}