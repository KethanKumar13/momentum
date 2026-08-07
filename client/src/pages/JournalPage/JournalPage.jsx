import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { useJournalStore } from "@/store/journalStore";
import { useDebounce } from "@/hooks/useDebounce";

import { JournalEntryCard } from "@/components/journal/JournalEntryCard";
import { JournalEditor } from "@/components/journal/JournalEditor";
import { JournalSearchBar } from "@/components/journal/JournalSearchBar";

import styles from "./JournalPage.module.css";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export default function JournalPage() {
  const { entries } = useJournalStore();

  const [editorOpen, setEditorOpen] =
    useState(false);
  const [editingEntry, setEditing] =
    useState(null);
  const [query, setQuery] =
    useState("");

  const debouncedQuery =
    useDebounce(query, 200);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return entries;
    }

    const q = debouncedQuery.toLowerCase();

    return entries.filter(
      (entry) =>
        entry.title
          ?.toLowerCase()
          .includes(q) ||
        entry.body
          ?.toLowerCase()
          .includes(q) ||
        entry.tags?.some((tag) =>
          tag.includes(q)
        )
    );
  }, [entries, debouncedQuery]);

  function handleEdit(entry) {
    setEditing(entry);
    setEditorOpen(true);
  }

  function handleClose() {
    setEditorOpen(false);
    setEditing(null);
  }

  return (
    <main
      id="main-content"
      className={styles.page}
    >
      <motion.div
        className={styles.inner}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <motion.header
          className={styles.header}
          variants={fadeUp}
        >
          <div>
            <p className={styles.sub}>
              Your daily journal
            </p>

            <h1 className={styles.heading}>
              Journal
            </h1>

            <p className={styles.meta}>
              {entries.length}{" "}
              {entries.length === 1
                ? "entry"
                : "entries"}
            </p>
          </div>

          <button
            type="button"
            className={styles.addBtn}
            onClick={() =>
              setEditorOpen(true)
            }
          >
            <Plus size={16} />
            Write today
          </button>
        </motion.header>

        <motion.div variants={fadeUp}>
          <JournalSearchBar
            value={query}
            onChange={setQuery}
          />
        </motion.div>

        <motion.div
          className={styles.list}
          variants={stagger}
        >
          {filtered.length === 0 ? (
            <motion.p
              className={styles.empty}
              variants={fadeUp}
            >
              {debouncedQuery
                ? "No entries match your search."
                : "No entries yet. Write your first one!"}
            </motion.p>
          ) : (
            filtered.map((entry) => (
              <motion.div
                key={entry.id}
                variants={fadeUp}
              >
                <JournalEntryCard
                  entry={entry}
                  onEdit={handleEdit}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      <JournalEditor
        open={editorOpen}
        onClose={handleClose}
        entry={editingEntry}
      />
    </main>
  );
}