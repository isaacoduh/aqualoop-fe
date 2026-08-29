"use client";

import { useEffect, useId, useRef } from "react";
import { AlertTriangle, CircleHelp } from "lucide-react";

import { classNames } from "@/lib/class-names";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pendingLabel?: string;
  tone?: "default" | "danger";
  pending?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pendingLabel = "Working…",
  tone = "default",
  pending = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      aria-busy={pending || undefined}
      className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-panel border border-border bg-surface p-0 text-foreground shadow-dialog backdrop:bg-foreground/45"
      onCancel={(event) => {
        event.preventDefault();

        if (!pending) {
          onOpenChange(false);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) {
          onOpenChange(false);
        }
      }}
    >
      <div className="p-6 sm:p-7">
        <div
          className={classNames(
            "grid size-11 place-items-center rounded-full",
            tone === "danger"
              ? "bg-danger-soft text-danger"
              : "bg-primary-soft text-primary",
          )}
        >
          {tone === "danger" ? (
            <AlertTriangle
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.75}
            />
          ) : (
            <CircleHelp
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.75}
            />
          )}
        </div>

        <h2 id={titleId} className="mt-4 text-xl font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p
            id={descriptionId}
            className="mt-2 text-sm leading-6 text-muted-foreground"
          >
            {description}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            className="min-h-control rounded-control border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={pending}
            className={classNames(
              "min-h-control rounded-control px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              tone === "danger"
                ? "bg-danger text-white hover:bg-danger/90"
                : "bg-primary text-primary-foreground hover:bg-primary-hover",
            )}
            onClick={onConfirm}
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
