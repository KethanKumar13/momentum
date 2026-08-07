import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useHabitsStore, CATEGORIES } from "@/store/habitsStore";
import styles from "./HabitFormModal.module.css";

const ICONS = [
  "🧘",
  "📖",
  "🚶",
  "💧",
  "🏋️",
  "🥗",
  "😴",
  "✍️",
  "🎯",
  "💪",
  "🧠",
  "🌱",
];

const empty = {
  label: "",
  icon: "🎯",
  category: "Health",
};

// ── Inner form — mounted fresh every time the modal opens ──────
function HabitForm({ initial, onClose, isEdit, habitId }) {
  const { addHabit, updateHabit } = useHabitsStore();
  const [form, setForm] = useState(initial);

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.label.trim()) {
      return;
    }

    if (isEdit) {
      updateHabit(habitId, form);
    } else {
      addHabit(form);
    }

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Label */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Habit name</span>

        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Read 20 pages"
          value={form.label}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              label: event.target.value,
            }))
          }
          required
          autoFocus
        />
      </label>

      {/* Category */}
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Category</span>

        <select
          className={styles.select}
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              category: event.target.value,
            }))
          }
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      {/* Icon picker */}
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Icon</span>

        <div className={styles.iconGrid}>
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`${styles.iconBtn} ${
                form.icon === icon ? styles.iconSelected : ""
              }`}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  icon,
                }))
              }
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

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
          {isEdit ? "Save changes" : "Add habit"}
        </button>
      </div>
    </form>
  );
}

// ── Shell — controls open/close only ──────────────────────────
export function HabitFormModal({ open, onClose, habit }) {
  const isEdit = Boolean(habit);

  const initial = habit
    ? {
        label: habit.label,
        icon: habit.icon,
        category: habit.category,
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
              {isEdit ? "Edit Habit" : "New Habit"}
            </Dialog.Title>

            <Dialog.Close
              className={styles.close}
              aria-label="Close"
            >
              <X size={18} />
            </Dialog.Close>
          </div>

          {/* key forces a full remount — new blank/pre-filled form every open */}
          <HabitForm
            key={habit?.id ?? "new"}
            initial={initial}
            onClose={onClose}
            isEdit={isEdit}
            habitId={habit?.id}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}