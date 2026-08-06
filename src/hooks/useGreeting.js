import { useMemo } from "react";

const QUOTES = [
  {
    text: "Small steps every day lead to big results.",
    author: "Unknown",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
  },
  {
    text: "You don't rise to the level of your goals, you fall to the level of your systems.",
    author: "James Clear",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
  {
    text: "It's not about perfect. It's about effort.",
    author: "Jillian Michaels",
  },
  {
    text: "Motivation gets you going. Habit keeps you growing.",
    author: "John C. Maxwell",
  },
  {
    text: "Focus on progress, not perfection.",
    author: "Unknown",
  },
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function getDailyQuote() {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return QUOTES[dayIndex % QUOTES.length];
}

export function useGreeting(name = "") {
  return useMemo(
    () => ({
      greeting: getGreeting(),
      name,
      quote: getDailyQuote(),
    }),
    [name]
  );
}