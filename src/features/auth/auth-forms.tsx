"use client";

import { useMutation } from "@tanstack/react-query";
import { Check, Mail, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { FormField, formControlClassName } from "@/components/ui";
import {
  authRepository,
  DEMO_PASSWORD,
  DEMO_VERIFICATION_CODE,
} from "@/features/auth/auth.repository";
import {
  FormAlert,
  PasswordInput,
  SubmitButton,
} from "@/features/auth/auth-controls";

type FieldErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()-]{10,20}$/;

function value(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

function passwordError(password: string): string | undefined {
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter.";
  if (!/\d/.test(password)) return "Add at least one number.";
  return undefined;
}

export function SignInForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const mutation = useMutation({
    mutationFn: ({ identity, password }: { identity: string; password: string }) =>
      authRepository.signIn(identity, password),
    onSuccess: (result) => {
      sessionStorage.setItem("aqualoop.pendingUserId", result.user.id);

      if (result.status === "verification-required") {
        router.push("/auth/verify");
        return;
      }

      router.push(authRepository.destinationForRole(result.user.role));
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identity = value(formData, "identity");
    const password = value(formData, "password");
    const nextErrors: FieldErrors = {};

    if (!identity) nextErrors.identity = "Enter your email address or phone number.";
    if (!password) nextErrors.password = "Enter your password.";

    setErrors(nextErrors);
    mutation.reset();

    if (Object.keys(nextErrors).length === 0) {
      mutation.mutate({ identity, password });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormField
        id="identity"
        label="Email address or phone number"
        error={errors.identity}
        required
        disabled={mutation.isPending}
      >
        {(accessibilityProps) => (
          <input
            {...accessibilityProps}
            name="identity"
            type="text"
            autoComplete="username"
            defaultValue="amina.bello@example.test"
            className={formControlClassName}
          />
        )}
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={errors.password}
        required
        disabled={mutation.isPending}
      >
        {(accessibilityProps) => (
          <PasswordInput
            {...accessibilityProps}
            name="password"
            autoComplete="current-password"
            defaultValue={DEMO_PASSWORD}
          />
        )}
      </FormField>

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input
            name="remember"
            type="checkbox"
            className="size-4 rounded border-border-strong accent-primary"
          />
          Keep me signed in
        </label>
        <Link
          href="/auth/forgot-password"
          className="font-semibold text-primary hover:text-primary-hover"
        >
          Forgot password?
        </Link>
      </div>

      {mutation.isError ? <FormAlert>{mutation.error.message}</FormAlert> : null}

      <SubmitButton pending={mutation.isPending}>Sign in</SubmitButton>

      <p className="rounded-control bg-primary-soft px-4 py-3 text-xs leading-5 text-info">
        Demo access is prefilled. Use password <strong>{DEMO_PASSWORD}</strong>.
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string>();
  const mutation = useMutation({
    mutationFn: authRepository.requestPasswordReset,
    onSuccess: (_result, identity) => setSentTo(identity),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identity = value(new FormData(event.currentTarget), "identity");

    if (!identity) {
      setError("Enter the email address or phone number on your account.");
      return;
    }

    setError(undefined);
    mutation.mutate(identity);
  }

  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Mail aria-hidden="true" className="size-6" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-foreground">
          Check your messages
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          If an account matches <strong>{sentTo}</strong>, we sent reset
          instructions. The demo can continue directly below.
        </p>
        <Link
          href="/auth/reset-password"
          className="mt-6 inline-flex min-h-control w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Continue to reset password
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormField
        id="identity"
        label="Email address or phone number"
        error={error}
        required
        disabled={mutation.isPending}
      >
        {(accessibilityProps) => (
          <input
            {...accessibilityProps}
            name="identity"
            type="text"
            autoComplete="username"
            placeholder="you@example.com"
            className={formControlClassName}
          />
        )}
      </FormField>
      <SubmitButton pending={mutation.isPending}>
        Send reset instructions
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const mutation = useMutation({ mutationFn: authRepository.resetPassword });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = value(formData, "password");
    const confirmation = value(formData, "confirmation");
    const nextErrors: FieldErrors = {};
    const passwordValidationError = passwordError(password);

    if (passwordValidationError) nextErrors.password = passwordValidationError;
    if (confirmation !== password) {
      nextErrors.confirmation = "The passwords must match.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) mutation.mutate(password);
  }

  if (mutation.isSuccess) {
    return (
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <Check aria-hidden="true" className="size-7" />
        </span>
        <h2 className="mt-5 text-xl font-semibold text-foreground">
          Password updated
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          You can now sign in with your new password.
        </p>
        <Link
          href="/auth/sign-in"
          className="mt-6 inline-flex min-h-control w-full items-center justify-center rounded-control bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormField
        id="password"
        label="New password"
        description="Use 10 or more characters with upper and lowercase letters and a number."
        error={errors.password}
        required
        disabled={mutation.isPending}
      >
        {(accessibilityProps) => (
          <PasswordInput
            {...accessibilityProps}
            name="password"
            autoComplete="new-password"
          />
        )}
      </FormField>
      <FormField
        id="confirmation"
        label="Confirm new password"
        error={errors.confirmation}
        required
        disabled={mutation.isPending}
      >
        {(accessibilityProps) => (
          <PasswordInput
            {...accessibilityProps}
            name="confirmation"
            autoComplete="new-password"
          />
        )}
      </FormField>
      <SubmitButton pending={mutation.isPending}>Update password</SubmitButton>
    </form>
  );
}

export function CustomerDetailsForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<FieldErrors>({});
  const mutation = useMutation({
    mutationFn: authRepository.registerCustomer,
    onSuccess: (user) => {
      sessionStorage.setItem("aqualoop.pendingUserId", user.id);
      sessionStorage.setItem("aqualoop.pendingIdentity", user.email);
      router.push("/customer/onboarding/verify");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = value(formData, "firstName");
    const lastName = value(formData, "lastName");
    const email = value(formData, "email");
    const phone = value(formData, "phone");
    const password = value(formData, "password");
    const confirmation = value(formData, "confirmation");
    const acceptedTerms = formData.get("terms") === "on";
    const nextErrors: FieldErrors = {};

    if (firstName.length < 2) nextErrors.firstName = "Enter your first name.";
    if (lastName.length < 2) nextErrors.lastName = "Enter your last name.";
    if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!phonePattern.test(phone)) nextErrors.phone = "Enter a valid phone number.";
    const passwordValidationError = passwordError(password);
    if (passwordValidationError) nextErrors.password = passwordValidationError;
    if (confirmation !== password) nextErrors.confirmation = "The passwords must match.";
    if (!acceptedTerms) nextErrors.terms = "Accept the terms to create your account.";

    setErrors(nextErrors);
    mutation.reset();

    if (Object.keys(nextErrors).length === 0) {
      mutation.mutate({ firstName, lastName, email, phone });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="firstName" label="First name" error={errors.firstName} required disabled={mutation.isPending}>
          {(props) => <input {...props} name="firstName" autoComplete="given-name" className={formControlClassName} />}
        </FormField>
        <FormField id="lastName" label="Last name" error={errors.lastName} required disabled={mutation.isPending}>
          {(props) => <input {...props} name="lastName" autoComplete="family-name" className={formControlClassName} />}
        </FormField>
      </div>
      <FormField id="email" label="Email address" error={errors.email} required disabled={mutation.isPending}>
        {(props) => <input {...props} name="email" type="email" autoComplete="email" className={formControlClassName} />}
      </FormField>
      <FormField id="phone" label="Phone number" description="Include your country code, for example +234." error={errors.phone} required disabled={mutation.isPending}>
        {(props) => <input {...props} name="phone" type="tel" autoComplete="tel" placeholder="+234 801 234 5678" className={formControlClassName} />}
      </FormField>
      <FormField id="password" label="Create password" description="Use 10 or more characters with upper and lowercase letters and a number." error={errors.password} required disabled={mutation.isPending}>
        {(props) => <PasswordInput {...props} name="password" autoComplete="new-password" />}
      </FormField>
      <FormField id="confirmation" label="Confirm password" error={errors.confirmation} required disabled={mutation.isPending}>
        {(props) => <PasswordInput {...props} name="confirmation" autoComplete="new-password" />}
      </FormField>
      <div>
        <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
          <input name="terms" type="checkbox" className="mt-1 size-4 shrink-0 rounded border-border-strong accent-primary" aria-invalid={errors.terms ? true : undefined} aria-describedby={errors.terms ? "terms-error" : undefined} />
          <span>
            I agree to the <Link href="/app/terms" className="font-semibold text-primary hover:text-primary-hover">terms</Link> and <Link href="/app/privacy" className="font-semibold text-primary hover:text-primary-hover">privacy policy</Link>.
          </span>
        </label>
        {errors.terms ? <p id="terms-error" role="alert" className="mt-1.5 text-sm font-medium text-danger">{errors.terms}</p> : null}
      </div>
      {mutation.isError ? <FormAlert>{mutation.error.message}</FormAlert> : null}
      <SubmitButton pending={mutation.isPending}>Create customer account</SubmitButton>
    </form>
  );
}

export function VerificationForm({ flow }: { flow: "auth" | "customer" }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const resendMutation = useMutation({
    mutationFn: () => authRepository.requestPasswordReset("pending account"),
  });
  const mutation = useMutation({
    mutationFn: (code: string) =>
      authRepository.verifyAccount(
        sessionStorage.getItem("aqualoop.pendingUserId"),
        code,
      ),
    onSuccess: () => {
      router.push(
        flow === "customer"
          ? "/customer/onboarding/success"
          : "/auth/verification-success",
      );
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = value(new FormData(event.currentTarget), "code").replaceAll(" ", "");

    if (!/^\d{6}$/.test(code)) {
      setError("Enter the complete six-digit code.");
      return;
    }

    setError(undefined);
    mutation.reset();
    mutation.mutate(code);
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <FormField
        id="code"
        label="Six-digit verification code"
        description={`For this demo, use ${DEMO_VERIFICATION_CODE}.`}
        error={error}
        required
        disabled={mutation.isPending}
      >
        {(props) => (
          <input
            {...props}
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            className={`${formControlClassName} text-center font-mono text-xl tracking-[0.45em]`}
          />
        )}
      </FormField>
      {mutation.isError ? <FormAlert>{mutation.error.message}</FormAlert> : null}
      <SubmitButton pending={mutation.isPending}>Verify account</SubmitButton>
      <button
        type="button"
        disabled={resendMutation.isPending}
        onClick={() => resendMutation.mutate()}
        className="flex min-h-control w-full items-center justify-center gap-2 rounded-control border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <RotateCcw aria-hidden="true" className={`size-4 ${resendMutation.isPending ? "animate-spin" : ""}`} />
        {resendMutation.isSuccess ? "Code sent again" : "Resend code"}
      </button>
    </form>
  );
}
