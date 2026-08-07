import { Link } from "react-router-dom";
import { Repeat2, Target, BookOpen } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import styles from "./LandingPage.module.css";

const features = [
  {
    icon: Repeat2,
    title: "Habit Tracking",
    description:
      "Build streaks and track daily habits linked to your real goals.",
  },
  {
    icon: Target,
    title: "Goal System",
    description:
      "Set long-term goals and break them into daily recurring actions.",
  },
  {
    icon: BookOpen,
    title: "Journal + Review",
    description:
      "Reflect daily and run a weekly review to stay on course.",
  },
];

export function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <p
          className="t-micro"
          style={{
            marginBottom: "var(--sp-4)",
          }}
        >
          Now in development
        </p>

        <h1 className={styles.heroHeading}>
          Small habits.
          <br />
          Real momentum.
        </h1>

        <p className={styles.heroSub}>
          Momentum connects your goals, habits, and daily actions in one
          beautifully focused app — so you actually become the person you
          want to be.
        </p>

        <div
          className="u-flex u-gap-3 u-wrap"
          style={{
            justifyContent: "center",
          }}
        >
          <Link to="/signup">
            <Button size="lg">
              Start for free
            </Button>
          </Link>

          <Link to="/login">
            <Button
              size="lg"
              variant="secondary"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className={styles.features}>
        {features.map((feature) => (
          <Card
            key={feature.title}
            hover
          >
            <CardBody className="u-stack-sm">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--radius-md)",
                  background: "rgba(124,92,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--brand-500)",
                  marginBottom: "var(--sp-2)",
                }}
              >
                <feature.icon size={20} />
              </div>

              <h3 className="t-h3">
                {feature.title}
              </h3>

              <p
                className="t-small"
                style={{
                  color: "var(--text-secondary)",
                }}
              >
                {feature.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
}