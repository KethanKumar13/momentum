import {
  Button,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Badge,
  Chip,
  Divider,
  Spinner,
  Skeleton,
} from "../../components/ui";

import { ThemeToggle } from "../../components/layout/ThemeToggle";

function Section({ title, children }) {
  return (
    <section
      className="u-stack"
      style={{ marginBlock: "var(--sp-8)" }}
    >
      <h2 className="t-h3">
        {title}
      </h2>

      <div className="u-flex u-gap-3 u-wrap u-items-center">
        {children}
      </div>
    </section>
  );
}

export function UIShowcasePage() {
  return (
    <main
      className="u-container"
      style={{ paddingBlock: "var(--sp-10)" }}
    >
      <header
        className="u-flex u-items-center u-justify-between"
        style={{ marginBottom: "var(--sp-8)" }}
      >
        <div>
          <p className="t-micro">
            Momentum · UI Showcase
          </p>

          <h1 className="t-h1">
            Primitives
          </h1>
        </div>

        <ThemeToggle />
      </header>

      <Section title="Buttons">
        <Button>Primary</Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="ghost">
          Ghost
        </Button>

        <Button variant="danger">
          Danger
        </Button>

        <Button loading>
          Loading
        </Button>

        <Button disabled>
          Disabled
        </Button>

        <Button size="sm">
          Small
        </Button>

        <Button size="lg">
          Large
        </Button>
      </Section>

      <Divider />

      <Section title="Inputs">
        <Input placeholder="Your email" />

        <Input
          placeholder="Disabled"
          disabled
        />

        <Textarea placeholder="What went well today?" />
      </Section>

      <Divider />

      <Section title="Toggles">
        <Checkbox>
          Remember me
        </Checkbox>

        <Switch aria-label="notifications" />
      </Section>

      <Divider />

      <Section title="Labels">
        <Badge>
          Health
        </Badge>

        <Badge tone="success">
          On track
        </Badge>

        <Badge tone="warning">
          At risk
        </Badge>

        <Chip>
          Filter · Habits
        </Chip>
      </Section>

      <Divider />

      <Section title="Loading">
        <Spinner />

        <Skeleton
          style={{
            width: 200,
            height: 16,
          }}
        />

        <Skeleton
          style={{
            width: 120,
            height: 40,
            borderRadius:
              "var(--radius-md)",
          }}
        />
      </Section>
    </main>
  );
}