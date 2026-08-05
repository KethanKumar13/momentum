import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import styles from "./AuthLayout.module.css";

const quotes = [
  "Small habits. Real momentum.",
  "Progress, not perfection.",
  "Every day is a new streak.",
  "Build the life you want, one habit at a time.",
];

export function AuthLayout() {
  const [quote] = useState(
    () => quotes[Math.floor(Math.random() * quotes.length)]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.formPanel}>
        <Link
          to="/"
          className={styles.logoLink}
          aria-label="Back to home"
        >
          <Logo />
        </Link>

        <div className={styles.formContent}>
          <Outlet />
        </div>
      </div>

      <div
        className={styles.heroPanel}
        aria-hidden="true"
      >
        <div className={styles.heroContent}>
          <p className={styles.heroQuote}>
            {quote}
          </p>

          <p className={styles.heroSub}>
            Momentum
          </p>
        </div>
      </div>
    </div>
  );
}