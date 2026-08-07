import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  useGoalsStore,
  GOAL_CATEGORIES,
  GOAL_TIMEFRAMES,
} from "@/store/goalsStore";
import styles from "./GoalFormModal.module.css";

const empty = {
  title: "",
  description: "",
  category: "Health",
  timeframe: "This month",
  target: 10,
};

// ── Inner form ───────────────────────────────────────────────
function GoalForm({ initial, onClose, isEdit, goalId }) {
  const { addGoal, updateGoal } = useGoalsStore();
  const [form, setForm] = useState(initial);

  function set(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    if (isEdit) {
      updateGoal(goalId, form);
    } else {
      addGoal(form);
    }

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Goal title</span>

        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Run a 5K"
          value={form.title}
          onChange={(event) => set("title", event.target.value)}
          required
          autoFocus
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          Description (optional)
        </span>

        <textarea
          className={styles.textarea}
          rows={2}
          placeholder="Why does this goal matter?"
          value={form.description}
          onChange={(event) =>
            set("description", event.target.value)
          }
        />
      </label>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Category
          </span>

          <select
            className={styles.select}
            value={form.category}
            onChange={(event) =>
              set("category", event.target.value)
            }
          >
            {GOAL_CATEGORIES.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>
            Timeframe
          </span>

          <select
            className={styles.select}
            value={form.timeframe}
            onChange={(event) =>
              set("timeframe", event.target.value)
            }
          >
            {GOAL_TIMEFRAMES.map((timeframe) => (
              <option
                key={timeframe}
                value={timeframe}
              >
                {timeframe}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          Target (number of steps / sessions)
        </span>

        <input
          className={styles.input}
          type="number"
          min={1}
          max={365}
          value={form.target}
          onChange={(event) =>
            set("target", Number(event.target.value))
          }
        />
      </label>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={styles.submitBtn}
        >
          {isEdit ? "Save changes" : "Add goal"}
        </button>
      </div>
    </form>
  );
}

// ── Modal shell ───────────────────────────────────────────────
export function GoalFormModal({
  open,
  onClose,
  goal,
}) {
  const isEdit = Boolean(goal);

  const initial = goal
    ? {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        timeframe: goal.timeframe,
        target: goal.target,
      }
    : empty;

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => !value && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              {isEdit ? "Edit Goal" : "New Goal"}
            </Dialog.Title>

            <Dialog.Close
              className={styles.close}
              aria-label="Close"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          <GoalForm
            key={goal?.id ?? "new"}
            initial={initial}
            onClose={onClose}
            isEdit={isEdit}
            goalId={goal?.id}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}