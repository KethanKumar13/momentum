import { BarChart3 } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import styles from "./Page.module.css";

export function InsightsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            Your data, your story
          </p>

          <h1 className={styles.heading}>
            Insights
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Visualise your habits, streaks, and mood trends over time.
          </p>
        </div>
      </div>

      <EmptyState
        icon={<BarChart3 size={24} />}
        title="Not enough data yet"
        description="Track at least 7 days of habits to start seeing your insights."
        action={
          <Button
            size="sm"
            variant="secondary"
          >
            Go to habits
          </Button>
        }
      />
    </div>
  );
}