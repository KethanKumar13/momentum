import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MOODS = [
  {
    value: "great",
    label: "Great",
    emoji: "😄",
  },
  {
    value: "good",
    label: "Good",
    emoji: "🙂",
  },
  {
    value: "okay",
    label: "Okay",
    emoji: "😐",
  },
  {
    value: "low",
    label: "Low",
    emoji: "😔",
  },
  {
    value: "rough",
    label: "Rough",
    emoji: "😞",
  },
];

const seedEntries = [
  {
    id: "j1",
    date: new Date(
      Date.now() - 86400000 * 2
    ).toISOString(),
    title: "A good start to the week",
    body: "Managed to meditate and go for a walk. Feeling more focused than usual. The morning routine is really starting to stick.",
    mood: "great",
    tags: [
      "productivity",
      "health",
    ],
  },
  {
    id: "j2",
    date: new Date(
      Date.now() - 86400000
    ).toISOString(),
    title: "Slow day but still showed up",
    body: "Didn't feel motivated but pushed through. Read a chapter and drank my water. Small wins count.",
    mood: "okay",
    tags: [
      "reflection",
    ],
  },
];

export const useJournalStore = create(
  persist(
    (set) => ({
      entries: seedEntries,

      addEntry: (data) =>
        set((state) => ({
          entries: [
            {
              id: `j${Date.now()}`,
              date: new Date().toISOString(),
              tags: [],
              ...data,
            },
            ...state.entries,
          ],
        })),

      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map(
            (entry) =>
              entry.id === id
                ? {
                    ...entry,
                    ...data,
                  }
                : entry
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter(
            (entry) => entry.id !== id
          ),
        })),
    }),
    {
      name: "momentum-journal",
      version: 1,
    }
  )
);