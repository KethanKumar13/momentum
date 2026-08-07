import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../../lib/cn";
import styles from "./Tabs.module.css";

export function Tabs({ children, className, ...props }) {
  return (
    <RadixTabs.Root className={cn(styles.root, className)} {...props}>
      {children}
    </RadixTabs.Root>
  );
}

export function TabsList({
  children,
  variant = "underline",
  className,
  ...props
}) {
  return (
    <RadixTabs.List
      className={cn(styles.list, styles[variant], className)}
      {...props}
    >
      {children}
    </RadixTabs.List>
  );
}

export function TabsTrigger({
  children,
  className,
  ...props
}) {
  return (
    <RadixTabs.Trigger
      className={cn(styles.trigger, className)}
      {...props}
    >
      {children}
    </RadixTabs.Trigger>
  );
}

export function TabsContent({
  children,
  className,
  ...props
}) {
  return (
    <RadixTabs.Content
      className={cn(styles.content, className)}
      {...props}
    >
      {children}
    </RadixTabs.Content>
  );
}
