import styles from "./VisuallyHidden.module.css";

export function VisuallyHidden({
  children,
  asChild = false,
  ...props
}) {
  const Tag = asChild ? "span" : "span";

  return (
    <Tag
      className={styles.hidden}
      {...props}
    >
      {children}
    </Tag>
  );
}
