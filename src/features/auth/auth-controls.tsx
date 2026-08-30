"use client";

import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { useState } from "react";

import { formControlClassName } from "@/components/ui";
import { classNames } from "@/lib/class-names";

export function SubmitButton({
  children,
  pending = false,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean }) {
  return (
    <button
      type="submit"
      className={classNames(
        "flex min-h-control w-full items-center justify-center gap-2 rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-foreground",
        className,
      )}
      disabled={pending || props.disabled}
      {...props}
    >
      {pending ? (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

export function PasswordInput(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={classNames(formControlClassName, "pr-11", props.className)}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
      </button>
    </div>
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="rounded-control border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-medium text-danger"
    >
      {children}
    </div>
  );
}
