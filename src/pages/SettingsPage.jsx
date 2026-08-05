import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Divider } from "../components/ui/Divider";
import { Switch } from "../components/ui/Switch";
import styles from "./Page.module.css";

export function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className="t-micro">
            Preferences
          </p>

          <h1 className={styles.heading}>
            Settings
          </h1>
        </div>
      </div>

      <div className="u-stack">
        <Card>
          <CardHeader>
            <span
              className="t-small"
              style={{ fontWeight: 600 }}
            >
              Profile
            </span>
          </CardHeader>

          <CardBody>
            <p
              className="t-small"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              Profile settings — coming in Week 2 with auth.
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span
              className="t-small"
              style={{ fontWeight: 600 }}
            >
              Notifications
            </span>
          </CardHeader>

          <CardBody className="u-stack-sm">
            <Switch label="Daily reminder" />

            <Divider />

            <Switch label="Weekly review prompt" />

            <Divider />

            <Switch label="Streak alerts" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <span
              className="t-small"
              style={{ fontWeight: 600 }}
            >
              Danger zone
            </span>
          </CardHeader>

          <CardBody>
            <Button
              variant="danger"
              size="sm"
            >
              Delete account
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}