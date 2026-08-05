import { cn } from "../../../lib/cn";
import styles from "./Card.module.css";

export function Card({
  children,
  variant = "default",
  hover = false,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        styles.card,
        styles[variant],
        hover && styles.hover,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(styles.header, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(styles.body, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(styles.footer, className)}
      {...props}
    >
      {children}
    </div>
  );
}
