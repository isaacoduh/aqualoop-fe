import type { ReactNode } from "react";

import { classNames } from "@/lib/class-names";

export interface FormControlAccessibilityProps {
  id: string;
  disabled?: true;
  required?: true;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
}

export interface FormFieldProps {
  id: string;
  label: ReactNode;
  children: (props: FormControlAccessibilityProps) => ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const formControlClassName =
  "min-h-control w-full rounded-control border border-border-strong bg-surface px-3 py-2 text-sm text-foreground shadow-xs transition-colors placeholder:text-muted-foreground hover:border-primary focus:border-primary focus:outline-none focus:ring-3 focus:ring-focus-ring/20 disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground";

export function FormField({
  id,
  label,
  children,
  description,
  error,
  required = false,
  disabled = false,
  className,
}: FormFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div
      className={classNames(
        "space-y-1.5",
        disabled && "opacity-70",
        className,
      )}
    >
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-danger">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>

      {children({
        id,
        disabled: disabled ? true : undefined,
        required: required ? true : undefined,
        "aria-describedby": describedBy || undefined,
        "aria-invalid": error ? true : undefined,
        "aria-required": required ? true : undefined,
      })}

      {description ? (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
