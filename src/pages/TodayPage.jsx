import { Sunrise } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import styles from "./Page.module.css";

export function TodayPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            Tuesday, 5 August
          </p>

          <h1 className={styles.heading}>
            Good morning, Kethan
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            You have 4 habits scheduled today.
          </p>
        </div>

        <Badge tone="success">
          3 day streak
        </Badge>
      </div>

      <div
        style={{
          marginBottom: "var(--sp-6)",
        }}
      >
        <p
          className="t-small"
          style={{
            marginBottom: "var(--sp-3)",
            color: "var(--text-muted)",
          }}
        >
          Today&apos;s progress
        </p>

        <ProgressBar
          value={25}
          size="md"
          showLabel
        />
      </div>

      <EmptyState
        icon={<Sunrise size={24} />}
        title="Your habits will appear here"
        description="Create your first habit to start tracking your daily progress."
        action={
          <Button size="sm">
            Add habit
          </Button>
        }
      />
    </div>
  );
}