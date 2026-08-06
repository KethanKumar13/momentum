import { motion } from "framer-motion";

import { useInsights } from "@/hooks/useInsights";

import { StatCard } from "@/components/insights/StatCard";
import { HabitHeatmap } from "@/components/insights/HabitHeatmap";
import { MoodChart } from "@/components/insights/MoodChart";
import { TopHabitsTable } from "@/components/insights/TopHabitsTable";
import { GoalsSummary } from "@/components/insights/GoalsSummary";

import styles from "./InsightsPage.module.css";

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
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

export default function InsightsPage() {
  const {
    totalHabits,
    completedToday,
    completionRate,
    longestStreak,
    topHabits,
    heatmapDays,
    totalGoals,
    completedGoals,
    avgGoalProgress,
    totalEntries,
    entriesThisWeek,
    moodCounts,
    dominantMood,
  } = useInsights();

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
              Your data, your story
            </p>

            <h1 className={styles.heading}>
              Insights
            </h1>

            <p className={styles.meta}>
              Based on your habits,
              goals & journal
            </p>
          </div>
        </motion.header>

        <motion.div
          className={styles.statsGrid}
          variants={fadeUp}
        >
          <StatCard
            label="Today's completion"
            value={`${completionRate}%`}
            sub={`${completedToday} of ${totalHabits} habits done`}
            icon="🎯"
            accent="primary"
          />

          <StatCard
            label="Longest streak"
            value={`${longestStreak}d`}
            sub="across all habits"
            icon="🔥"
            accent="warning"
          />

          <StatCard
            label="Goals completed"
            value={`${completedGoals}/${totalGoals}`}
            sub={`avg ${avgGoalProgress}% progress`}
            icon="🏆"
            accent="success"
          />

          <StatCard
            label="Journal entries"
            value={totalEntries}
            sub={`${entriesThisWeek} this week`}
            icon="📓"
          />
        </motion.div>

        <div className={styles.grid}>
          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Habit activity — last
              5 weeks
            </h2>

            <HabitHeatmap
              days={heatmapDays}
            />
          </motion.section>

          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Mood distribution

              {dominantMood && (
                <span
                  className={
                    styles.dominantMood
                  }
                >
                  {dominantMood.emoji}
                  {" "}
                  mostly{" "}
                  {dominantMood.label.toLowerCase()}
                </span>
              )}
            </h2>

            <MoodChart
              moodCounts={moodCounts}
            />
          </motion.section>

          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Top habits by streak
            </h2>

            {topHabits.length > 0 ? (
              <TopHabitsTable
                habits={topHabits}
              />
            ) : (
              <p className={styles.empty}>
                No habits yet.
              </p>
            )}
          </motion.section>

          <motion.section
            className={styles.section}
            variants={fadeUp}
          >
            <h2 className={styles.sectionTitle}>
              Goals progress
            </h2>

            {totalGoals > 0 ? (
              <GoalsSummary />
            ) : (
              <p className={styles.empty}>
                No goals yet.
              </p>
            )}
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}