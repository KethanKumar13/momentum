import { create } from "zustand";
import { persist } from "zustand/middleware";

export const GOAL_CATEGORIES = [
  "Health",
  "Career",
  "Learning",
  "Finance",
  "Personal",
  "Other",
];

export const GOAL_TIMEFRAMES = [
  "This week",
  "This month",
  "This quarter",
  "This year",
  "Long-term",
];

const seedGoals = [
  {
    id: "g1",
    title: "Run a 5K",
    description: "Build up to running a full 5K without stopping.",
    category: "Health",
    timeframe: "This month",
    target: 20,
    progress: 8,
    linkedHabits: ["h3"],
    createdAt: Date.now(),
  },
  {
    id: "g2",
    title: "Read 12 books this year",
    description: "One book per month across different genres.",
    category: "Learning",
    timeframe: "This year",
    target: 12,
    progress: 3,
    linkedHabits: ["h2"],
    createdAt: Date.now(),
  },
  {
    id: "g3",
    title: "Build a meditation habit",
    description: "30-day streak of daily meditation.",
    category: "Personal",
    timeframe: "This month",
    target: 30,
    progress: 7,
    linkedHabits: ["h1"],
    createdAt: Date.now(),
  },
];

export const useGoalsStore = create(
  persist(
    (set) => ({
      goals: seedGoals,

      addGoal: (data) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              id: `g${Date.now()}`,
              progress: 0,
              linkedHabits: [],
              createdAt: Date.now(),
              ...data,
            },
          ],
        })),

      updateGoal: (id, data) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  ...data,
                }
              : goal
          ),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      incrementProgress: (id) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  progress: Math.min(
                    goal.target,
                    goal.progress + 1
                  ),
                }
              : goal
          ),
        })),
    }),
    {
      name: "momentum-goals",
      version: 1,
    }
  )
);