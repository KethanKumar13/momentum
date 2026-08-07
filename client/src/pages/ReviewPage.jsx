import { Sparkles } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import styles from "./Page.module.css";

export function ReviewPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            End of week
          </p>

          <h1 className={styles.heading}>
            Weekly Review
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Reflect on the past week and plan what comes next.
          </p>
        </div>
      </div>

      <EmptyState
        icon={<Sparkles size={24} />}
        title="No reviews yet"
        description="Complete your first week of habits to unlock your weekly review."
        action={
          <Button
            size="sm"
            variant="secondary"
          >
            Learn more
          </Button>
        }
      />
    </div>
  );
}