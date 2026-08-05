import { BookOpen } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import styles from "./Page.module.css";

export function JournalPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            Your daily journal
          </p>

          <h1 className={styles.heading}>
            Journal
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Reflect on your day. One entry at a time.
          </p>
        </div>

        <Button size="sm">
          Write today
        </Button>
      </div>

      <EmptyState
        icon={<BookOpen size={24} />}
        title="No entries yet"
        description="Start your journaling habit — write your first entry today."
        action={
          <Button size="sm">
            Write first entry
          </Button>
        }
      />
    </div>
  );
}