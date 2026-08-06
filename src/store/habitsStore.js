import { create } from "zustand";
import { persist } from "zustand/middleware";

const CATEGORIES = [
  "Health",
  "Career",
  "Learning",
  "Finance",
  "Mindfulness",
  "Other",
];

const seedHabits = [
  {
    id: "h1",
    label: "Morning meditation",
    icon: "🧘",
    category: "Mindfulness",
    streak: 7,
    completedToday: false,
    createdAt: Date.now(),
  },
  {
    id: "h2",
    label: "Read 20 pages",
    icon: "📖",
    category: "Learning",
    streak: 3,
    completedToday: false,
    createdAt: Date.now(),
  },
  {
    id: "h3",
    label: "Evening walk",
    icon: "🚶",
    category: "Health",
    streak: 12,
    completedToday: false,
    createdAt: Date.now(),
  },
  {
    id: "h4",
    label: "Drink 2L water",
    icon: "💧",
    category: "Health",
    streak: 5,
    completedToday: true,
    createdAt: Date.now(),
  },
];

export { CATEGORIES };

export const useHabitsStore = create(
  persist(
    (set) => ({
      habits: seedHabits,
      activeFilter: "All",

      setFilter: (filter) =>
        set({
          activeFilter: filter,
        }),

      addHabit: (data) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              id: `h${Date.now()}`,
              streak: 0,
              completedToday: false,
              createdAt: Date.now(),
              ...data,
            },
          ],
        })),

      updateHabit: (id, data) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  ...data,
                }
              : habit
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        })),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? {
                  ...habit,
                  completedToday: !habit.completedToday,
                  streak: !habit.completedToday
                    ? habit.streak + 1
                    : Math.max(0, habit.streak - 1),
                }
              : habit
          ),
        })),
    }),
    {
      name: "momentum-habits",
      version: 1,
    }
  )
);