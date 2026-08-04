import * as RadixTooltip from "@radix-ui/react-tooltip";
import styles from "./Tooltip.module.css";

export function TooltipProvider({
  children,
}) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      {children}
    </RadixTooltip.Provider>
  );
}

export function Tooltip({
  children,
  content,
  side = "top",
}) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>
        {children}
      </RadixTooltip.Trigger>

      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className={styles.content}
        >
          {content}

          <RadixTooltip.Arrow
            className={styles.arrow}
          />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
