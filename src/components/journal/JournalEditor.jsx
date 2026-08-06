import { useState } from "react";
import { X } from "lucide-react";
import { useJournalStore } from "@/store/journalStore";
import { MoodPicker } from "./MoodPicker";
import styles from "./JournalEditor.module.css";

function EditorForm({
  initial,
  isEdit,
  entryId,
  onClose,
}) {
  const {
    addEntry,
    updateEntry,
  } = useJournalStore();

  const [form, setForm] = useState(initial);
  const [tagInput, setTagInput] = useState("");

  function set(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function addTag(event) {
    if (
      event.key === "Enter" ||
      event.key === ","
    ) {
      event.preventDefault();

      const tag = tagInput
        .trim()
        .toLowerCase()
        .replace(/,/g, "");

      if (
        tag &&
        !form.tags.includes(tag)
      ) {
        set("tags", [
          ...form.tags,
          tag,
        ]);
      }

      setTagInput("");
    }
  }

  function removeTag(tag) {
    set(
      "tags",
      form.tags.filter(
        (currentTag) =>
          currentTag !== tag
      )
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.body.trim()) {
      return;
    }

    if (isEdit) {
      updateEntry(entryId, form);
    } else {
      addEntry(form);
    }

    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          Title (optional)
        </span>

        <input
          className={styles.input}
          type="text"
          placeholder="What's on your mind?"
          value={form.title}
          onChange={(event) =>
            set(
              "title",
              event.target.value
            )
          }
          autoFocus
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          Entry
        </span>

        <textarea
          className={styles.textarea}
          rows={8}
          placeholder="Write freely — this is just for you..."
          value={form.body}
          onChange={(event) =>
            set(
              "body",
              event.target.value
            )
          }
          required
        />
      </label>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>
          How are you feeling?
        </span>

        <MoodPicker
          value={form.mood}
          onChange={(value) =>
            set("mood", value)
          }
        />
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel}>
          Tags (press Enter to add)
        </span>

        <div className={styles.tagWrap}>
          {form.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
            >
              #{tag}

              <button
                type="button"
                className={styles.tagRemove}
                onClick={() =>
                  removeTag(tag)
                }
              >
                <X size={10} />
              </button>
            </span>
          ))}

          <input
            className={styles.tagInput}
            type="text"
            placeholder="e.g. health, work"
            value={tagInput}
            onChange={(event) =>
              setTagInput(
                event.target.value
              )
            }
            onKeyDown={addTag}
          />
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
          {isEdit
            ? "Save changes"
            : "Save entry"}
        </button>
      </div>
    </form>
  );
}

export function JournalEditor({
  open,
  onClose,
  entry,
}) {
  if (!open) {
    return null;
  }

  const isEdit = Boolean(entry);

  const initial = entry
    ? {
        title: entry.title,
        body: entry.body,
        mood: entry.mood,
        tags: entry.tags,
      }
    : {
        title: "",
        body: "",
        mood: "good",
        tags: [],
      };

  return (
    <div
      className={styles.overlay}
      onClick={(event) =>
        event.target ===
          event.currentTarget &&
        onClose()
      }
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEdit
              ? "Edit entry"
              : "New entry"}
          </h2>

          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          <EditorForm
            key={entry?.id ?? "new"}
            initial={initial}
            isEdit={isEdit}
            entryId={entry?.id}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}