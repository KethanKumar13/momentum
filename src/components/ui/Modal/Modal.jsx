import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./Modal.module.css";

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  className,
}) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.overlay}
        />

        <Dialog.Content
          className={cn(
            styles.content,
            styles[size],
            className
          )}
          aria-describedby={
            description
              ? "modal-desc"
              : undefined
          }
        >
          <div className={styles.header}>
            <Dialog.Title
              className={styles.title}
            >
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className={styles.close}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          {description ? (
            <Dialog.Description
              id="modal-desc"
              className={styles.description}
            >
              {description}
            </Dialog.Description>
          ) : (
            <VisuallyHidden>
              Modal
            </VisuallyHidden>
          )}

          <div className={styles.body}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Dialog as ModalPrimitive };
