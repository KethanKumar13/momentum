import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "var(--sp-6)",
        background: "var(--bg-base)",
      }}
    >
      <div className="u-stack-lg u-text-center">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "4rem",
            fontWeight: 700,
            background: "var(--grad-momentum)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </p>

        <h1 className="t-h2">
          Page not found
        </h1>

        <p
          className="t-body"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <Link to="/">
          <Button>
            Back to home
          </Button>
        </Link>
      </div>
    </main>
  );
}