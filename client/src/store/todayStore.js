import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Seed data (replaced by real API in Week 2) ──────────────
const seedHabits = [
  {
    id: "h1",
    label: "Morning meditation",
    icon: "🧘",
    streak: 7,
    completedToday: false,
  },
  {
    id: "h2",
    label: "Read 20 pages",
    icon: "📖",
    streak: 3,
    completedToday: false,
  },
  {
    id: "h3",
    label: "Evening walk",
    icon: "🚶",
    streak: 12,
    completedToday: false,
  },
  {
    id: "h4",
    label: "Drink 2L water",
    icon: "💧",
    streak: 5,
    completedToday: true,
  },
];

const seedTasks = [
  {
    id: "t1",
    label: "Review project proposal",
    priority: "high",
    done: false,
  },
  {
    id: "t2",
    label: "Reply to team messages",
    priority: "medium",
    done: false,
  },
  {
    id: "t3",
    label: "Update weekly log",
    priority: "low",
    done: true,
  },
  {
    id: "t4",
    label: "Plan tomorrow",
    priority: "medium",
    done: false,
  },
];

export const useTodayStore = create(
  persist(
    (set) => ({
      habits: seedHabits,
      tasks: seedTasks,

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

      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  done: !task.done,
                }
              : task
          ),
        })),
    }),
    {
      name: "momentum-today",
      version: 1,
    }
  )
);