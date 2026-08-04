import { useState } from "react";
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
  Switch,
  Select,
  Badge,
  Chip,
  Divider,
  Spinner,
  Skeleton,
  VisuallyHidden,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
  ProgressBar,
  ProgressRing,
  Avatar,
  toast,
} from "../../components/ui";
import { ThemeToggle } from "../../components/layout/ThemeToggle";
import { Settings, Inbox } from "lucide-react";

function Section({ title, children }) {
  return (
    <section style={{ marginBlock: "var(--sp-8)" }}>
      <h2
        className="t-h3"
        style={{ marginBottom: "var(--sp-4)", color: "var(--text-muted)" }}
      >
        {title}
      </h2>
      <div className="u-flex u-gap-3 u-wrap u-items-center">{children}</div>
    </section>
  );
}

export function UIShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [tab, setTab] = useState("one");

  return (
    <main className="u-container" style={{ paddingBlock: "var(--sp-10)" }}>
      {/* Header */}
      <header
        className="u-flex u-items-center u-justify-between"
        style={{ marginBottom: "var(--sp-8)" }}
      >
        <div>
          <p className="t-micro">Momentum - Week 1 - Day 3</p>
          <h1 className="t-h1">UI Showcase</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Buttons */}
      <Section title="Button">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
      </Section>
      <Divider />

      {/* Icon Buttons */}
      <Section title="IconButton">
        <IconButton label="Settings">
          <Settings size={18} />
        </IconButton>
        <IconButton label="Settings" variant="outline">
          <Settings size={18} />
        </IconButton>
        <IconButton label="Settings" variant="brand">
          <Settings size={18} />
        </IconButton>
      </Section>
      <Divider />

      {/* Inputs */}
      <Section title="Input">
        <div style={{ width: 280 }}>
          <Input label="Email" placeholder="you@email.com" />
        </div>
        <div style={{ width: 280 }}>
          <Input
            label="With error"
            placeholder="..."
            error="This field is required"
          />
        </div>
        <div style={{ width: 280 }}>
          <Input placeholder="No label, disabled" disabled />
        </div>
      </Section>
      <Divider />

      {/* Textarea */}
      <Section title="Textarea">
        <div style={{ width: 320 }}>
          <Textarea label="Journal" placeholder="What went well today?" />
        </div>
      </Section>
      <Divider />

      {/* Select */}
      <Section title="Select">
        <div style={{ width: 220 }}>
          <Select
            label="Category"
            options={[
              { value: "health", label: "Health" },
              { value: "career", label: "Career" },
              { value: "learning", label: "Learning" },
            ]}
          />
        </div>
      </Section>
      <Divider />

      {/* Toggles */}
      <Section title="Checkbox and Switch">
        <Checkbox checked={checked} onCheckedChange={setChecked}>
          {checked ? "Checked" : "Unchecked"}
        </Checkbox>
        <Switch
          label={switched ? "On" : "Off"}
          checked={switched}
          onCheckedChange={setSwitched}
        />
      </Section>
      <Divider />

      {/* Badge */}
      <Section title="Badge">
        <Badge>Default</Badge>
        <Badge tone="brand">Brand</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="info">Info</Badge>
      </Section>

      {/* Chip */}
      <Section title="Chip">
        <Chip>All habits</Chip>
        <Chip active>Health</Chip>
        <Chip onRemove={() => {}}>Removable</Chip>
      </Section>
      <Divider />

      {/* Tabs */}
      <Section title="Tabs">
        <div style={{ width: "100%" }}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList variant="underline">
              <TabsTrigger value="one">Today</TabsTrigger>
              <TabsTrigger value="two">Habits</TabsTrigger>
              <TabsTrigger value="three">Goals</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <p className="t-small">Today tab content</p>
            </TabsContent>
            <TabsContent value="two">
              <p className="t-small">Habits tab content</p>
            </TabsContent>
            <TabsContent value="three">
              <p className="t-small">Goals tab content</p>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
      <Divider />

      {/* Card */}
      <Section title="Card">
        <Card style={{ width: 240 }}>
          <CardHeader>
            <span className="t-small">Card header</span>
          </CardHeader>
          <CardBody>
            <p className="t-small">Card body content goes here.</p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="secondary">
              Action
            </Button>
          </CardFooter>
        </Card>
        <Card variant="elevated" hover style={{ width: 200 }}>
          <CardBody>
            <p className="t-small">Elevated and hover lift</p>
          </CardBody>
        </Card>
      </Section>
      <Divider />

      {/* Tooltip */}
      <Section title="Tooltip">
        <Tooltip content="This is a tooltip">
          <Button variant="secondary">Hover me</Button>
        </Tooltip>
      </Section>
      <Divider />

      {/* Modal */}
      <Section title="Modal">
        <Button onClick={() => setModalOpen(true)}>Open modal</Button>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="Create new habit"
          description="Set up a recurring habit linked to one of your goals."
        >
          <div className="u-stack">
            <Input label="Habit name" placeholder="e.g. Run 2km" />
            <Button onClick={() => setModalOpen(false)}>Save habit</Button>
          </div>
        </Modal>
      </Section>
      <Divider />

      {/* Toast */}
      <Section title="Toast">
        <Button onClick={() => toast.success("Habit checked off!")}>
          Success toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.error("Something went wrong")}
        >
          Error toast
        </Button>
        <Button variant="ghost" onClick={() => toast.info("Syncing your data...")}>
          Info toast
        </Button>
      </Section>
      <Divider />

      {/* Empty State */}
      <Section title="EmptyState">
        <EmptyState
          icon={<Inbox size={24} />}
          title="No habits yet"
          description="Create your first habit to start building momentum."
          action={<Button size="sm">Add habit</Button>}
        />
      </Section>
      <Divider />

      {/* Progress */}
      <Section title="ProgressBar">
        <div style={{ width: 260 }}>
          <ProgressBar value={72} showLabel />
        </div>
        <div style={{ width: 260 }}>
          <ProgressBar value={35} size="sm" showLabel />
        </div>
      </Section>

      <Section title="ProgressRing">
        <ProgressRing value={72} size={80} strokeWidth={6}>
          <span className="t-mono" style={{ fontSize: "0.75rem" }}>
            72%
          </span>
        </ProgressRing>
        <ProgressRing value={35} size={56} strokeWidth={5} />
        <ProgressRing value={100} size={56} strokeWidth={5} />
      </Section>
      <Divider />

      {/* Avatar */}
      <Section title="Avatar">
        <Avatar name="Kethan Kumar" size="sm" />
        <Avatar name="Kethan Kumar" size="md" />
        <Avatar name="Kethan Kumar" size="lg" />
        <Avatar name="Kethan Kumar" size="xl" />
        <Avatar size="md" />
      </Section>
      <Divider />

      {/* Spinner */}
      <Section title="Spinner">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </Section>

      {/* Skeleton */}
      <Section title="Skeleton">
        <Skeleton style={{ width: 200, height: 16 }} />
        <Skeleton style={{ width: 120, height: 40 }} />
        <Skeleton style={{ width: 56, height: 56, borderRadius: "50%" }} />
      </Section>

      <VisuallyHidden>This text is only for screen readers</VisuallyHidden>
    </main>
  );
}