import { Target } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import styles from "./Page.module.css";

export function GoalsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            What you are working toward
          </p>

          <h1 className={styles.heading}>
            Goals
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Set meaningful goals and link your habits to them.
          </p>
        </div>

        <Button size="sm">
          New goal
        </Button>
      </div>

      <EmptyState
        icon={<Target size={24} />}
        title="No goals yet"
        description="Define where you want to go. Your habits will get you there."
        action={
          <Button size="sm">
            Set your first goal
          </Button>
        }
      />
    </div>
  );
}