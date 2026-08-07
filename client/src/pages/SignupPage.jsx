import { Link } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import styles from "./AuthPage.module.css";

export function SignupPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        Create your account
      </h1>

      <p className={styles.sub}>
        Already have an account?{" "}
        <Link
          to="/login"
          className={styles.link}
        >
          Sign in
        </Link>
      </p>

      <form
        className={styles.form}
        onSubmit={(event) => event.preventDefault()}
      >
        <Input
          label="Full name"
          type="text"
          placeholder="Kethan Kumar"
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min 8 characters"
        />

        <Button
          type="submit"
          size="lg"
          style={{ width: "100%" }}
        >
          Get started free
        </Button>

        <p
          className="t-micro u-text-center"
          style={{ color: "var(--text-muted)" }}
        >
          By signing up you agree to our Terms of Service.
        </p>
      </form>
    </div>
  );
}