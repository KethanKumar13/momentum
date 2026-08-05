import { Repeat2 } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Chip } from "../components/ui/Chip";
import styles from "./Page.module.css";

export function HabitsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            Your habits
          </p>

          <h1 className={styles.heading}>
            Habits
          </h1>

          <p
            className="t-body"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            Track the small actions that build real momentum.
          </p>
        </div>

        <Button size="sm">
          New habit
        </Button>
      </div>

      <div
        className="u-flex u-gap-2 u-wrap"
        style={{
          marginBottom: "var(--sp-6)",
        }}
      >
        {[
          "All",
          "Health",
          "Career",
          "Learning",
          "Finance",
        ].map((filter) => (
          <Chip
            key={filter}
            active={filter === "All"}
          >
            {filter}
          </Chip>
        ))}
      </div>

      <EmptyState
        icon={<Repeat2 size={24} />}
        title="No habits yet"
        description="Create your first habit and start building your streak."
        action={
          <Button size="sm">
            Add your first habit
          </Button>
        }
      />
    </div>
  );
}