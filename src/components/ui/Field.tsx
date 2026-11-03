import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
} from "react";
import { cn } from "@/lib/cn";

type ControlProps = {
  id?: string;
  "aria-describedby"?: string;
  invalid?: boolean;
};

export type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Single form control (Input / Textarea / Select). Field wires id and describedby. */
  children: ReactElement<ControlProps>;
  className?: string;
};

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const child = Children.only(children);
  const control = isValidElement(child)
    ? cloneElement(child, {
        id,
        "aria-describedby": describedBy,
        invalid: Boolean(error) || child.props.invalid,
      })
    : child;

  return (
    <div className={cn("flex flex-col gap-2 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
      </label>
      {control}
      {hint && !error ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-orange" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
