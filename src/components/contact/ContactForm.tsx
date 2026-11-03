"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CONTACT_SERVICE_IDS,
  contactServiceOptions,
  contactStageOptions,
} from "@/content/contact";
import {
  createContactSchema,
  type ContactFormValues,
} from "@/lib/contact-schema";
import { Button, Field, Input, Select, Text, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";

type Status =
  | { type: "idle" }
  | { type: "success" }
  | { type: "error"; code: string };

export type ContactFormProps = {
  className?: string;
  idPrefix?: string;
  /** Denser spacing for embedding in sections. */
  compact?: boolean;
  /** Fallback channel hint shown on failure (resolved contact only). */
  alternateChannelHref?: string | null;
  alternateChannelLabel?: string | null;
};

export function ContactForm({
  className,
  idPrefix = "contact",
  compact = false,
  alternateChannelHref = null,
  alternateChannelLabel = null,
}: ContactFormProps) {
  const t = useTranslations("Contact");
  const reactId = useId();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const successRef = useRef<HTMLDivElement | null>(null);

  const serviceFromQuery = searchParams.get("service")?.trim() ?? "";
  const preselectedService = CONTACT_SERVICE_IDS.includes(serviceFromQuery)
    ? serviceFromQuery
    : "";

  const schema = createContactSchema({
    nameRequired: t("errors.nameRequired"),
    nameMax: t("errors.nameMax"),
    contactRequired: t("errors.contactRequired"),
    phoneInvalid: t("errors.phoneInvalid"),
    emailInvalid: t("errors.emailInvalid"),
    serviceRequired: t("errors.serviceRequired"),
    stageRequired: t("errors.stageRequired"),
    messageRequired: t("errors.messageRequired"),
    messageMax: t("errors.messageMax"),
    consentRequired: t("errors.consentRequired"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    // zod input/output diverge slightly on defaulted string fields
    resolver: zodResolver(schema) as never,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: preselectedService,
      stage: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  useEffect(() => {
    if (status.type !== "success") return;
    successRef.current?.focus();
  }, [status]);

  async function onSubmit(values: ContactFormValues) {
    setStatus({ type: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          email: values.email,
          service: values.service,
          stage: values.stage,
          message: values.message,
          consent: values.consent,
          website: values.website ?? "",
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        code?: string;
        message?: string;
      };

      if (response.ok && data.ok) {
        setStatus({ type: "success" });
        return;
      }

      setStatus({
        type: "error",
        code: data.code ?? data.message ?? "unknown",
      });
    } catch {
      setStatus({ type: "error", code: "network" });
    }
  }

  function errorMessage(code: string): string {
    switch (code) {
      case "rate_limited":
        return t("status.rateLimited");
      case "misconfigured":
      case "webhook_missing":
        return t("status.misconfigured");
      case "upstream_error":
      case "upstream_unreachable":
        return t("status.upstream");
      case "validation_error":
        return t("status.validation");
      case "network":
        return t("status.network");
      default:
        return t("status.generic");
    }
  }

  if (status.type === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn(
          "rounded-tile border border-line bg-panel px-5 py-6 outline-none focus-visible:ring-2 focus-visible:ring-sky",
          className,
        )}
      >
        <Text variant="body" className="text-ok">
          {t("status.success")}
        </Text>
      </div>
    );
  }

  const serviceId = `${idPrefix}-service-${reactId}`;
  const stageId = `${idPrefix}-stage-${reactId}`;
  const consentId = `${idPrefix}-consent-${reactId}`;

  return (
    <form
      className={cn(
        "relative flex flex-col",
        compact ? "gap-4" : "gap-5",
        className,
      )}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-describedby={
        status.type === "error" ? `${idPrefix}-form-error-${reactId}` : undefined
      }
    >
      <Field
        id={`${idPrefix}-name-${reactId}`}
        label={t("fields.name")}
        error={errors.name?.message}
      >
        <Input
          autoComplete="name"
          placeholder={t("placeholders.name")}
          {...register("name")}
        />
      </Field>

      <div
        className={cn(
          "grid gap-5",
          compact ? "gap-4 sm:grid-cols-2" : "sm:grid-cols-2",
        )}
      >
        <Field
          id={`${idPrefix}-phone-${reactId}`}
          label={t("fields.phone")}
          hint={t("hints.phoneOrEmail")}
          error={errors.phone?.message}
        >
          <Input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t("placeholders.phone")}
            {...register("phone")}
          />
        </Field>

        <Field
          id={`${idPrefix}-email-${reactId}`}
          label={t("fields.email")}
          error={errors.email?.message}
        >
          <Input
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("placeholders.email")}
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        id={serviceId}
        label={t("fields.service")}
        error={errors.service?.message}
      >
        <Select {...register("service")}>
          <option value="" disabled>
            {t("placeholders.service")}
          </option>
          {contactServiceOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {t(`services.${option.messageKey}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id={stageId}
        label={t("fields.stage")}
        error={errors.stage?.message}
      >
        <Select {...register("stage")}>
          <option value="" disabled>
            {t("placeholders.stage")}
          </option>
          {contactStageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {t(`stages.${option.messageKey}`)}
            </option>
          ))}
        </Select>
      </Field>

      <Field
        id={`${idPrefix}-message-${reactId}`}
        label={t("fields.message")}
        error={errors.message?.message}
      >
        <Textarea
          rows={compact ? 4 : 5}
          placeholder={t("placeholders.message")}
          {...register("message")}
        />
      </Field>

      <div className="flex flex-col gap-2 text-start">
        <label
          htmlFor={consentId}
          className="flex cursor-pointer items-start gap-3 text-sm text-text"
        >
          <input
            id={consentId}
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-line accent-blue"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={
              errors.consent ? `${consentId}-error` : undefined
            }
            {...register("consent")}
          />
          <span>{t("fields.consent")}</span>
        </label>
        {errors.consent?.message ? (
          <p
            id={`${consentId}-error`}
            className="text-sm text-orange"
            role="alert"
          >
            {errors.consent.message}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from users; bots that fill it are dropped server-side. */}
      <div
        className="absolute -start-[10000px] h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor={`${idPrefix}-website-${reactId}`}>
          {t("fields.website")}
        </label>
        <input
          id={`${idPrefix}-website-${reactId}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      {status.type === "error" ? (
        <div
          id={`${idPrefix}-form-error-${reactId}`}
          className="rounded-[var(--radius-card)] border border-line bg-panel px-4 py-3"
          role="alert"
          aria-live="assertive"
        >
          <Text variant="body" className="text-orange">
            {errorMessage(status.code)}
          </Text>
          {alternateChannelHref && alternateChannelLabel ? (
            <Text variant="muted" className="mt-2 text-sm">
              {t("status.tryChannel")}{" "}
              <a
                href={alternateChannelHref}
                className="font-medium text-blue underline-offset-2 hover:underline"
              >
                {alternateChannelLabel}
              </a>
            </Text>
          ) : (
            <Text variant="muted" className="mt-2 text-sm">
              {t("status.tryLater")}
            </Text>
          )}
        </div>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("submitting") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
