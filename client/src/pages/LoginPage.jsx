import { Link } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import styles from "./AuthPage.module.css";

export function LoginPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        Welcome back
      </h1>

      <p className={styles.sub}>
        Don&apos;t have an account?{" "}
        <Link
          to="/signup"
          className={styles.link}
        >
          Sign up free
        </Link>
      </p>

      <form
        className={styles.form}
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Your password"
        />

        <Link
          to="/forgot-password"
          className={styles.link}
          style={{
            fontSize: "var(--fs-small)",
            alignSelf: "flex-end",
          }}
        >
          Forgot password?
        </Link>

        <Button
          type="submit"
          size="lg"
          style={{ width: "100%" }}
        >
          Sign in
        </Button>
      </form>
    </div>
  );
}