/**
 * Site chrome content (nav hrefs, parent brand, contact).
 * Contact values marked TODO_REAL_DATA are omitted from the public UI.
 */

export const TODO_REAL_DATA = "TODO_REAL_DATA" as const;

export type NavItem = {
  id: "services" | "portfolio" | "process" | "insights" | "about";
  /** Locale-agnostic path (next-intl Link href). */
  href: string;
};

/** Primary FloatingNav links (services expands via content/services). */
export const primaryNav: NavItem[] = [
  { id: "services", href: "/services" },
  { id: "portfolio", href: "/portfolio" },
  { id: "process", href: "/process" },
  { id: "insights", href: "/insights" },
  { id: "about", href: "/about" },
];

export type ResourceNavItem = {
  id: "portfolio" | "insights" | "faq" | "process";
  href: string;
};

/** Footer resources column. */
export const resourceNav: ResourceNavItem[] = [
  { id: "portfolio", href: "/portfolio" },
  { id: "insights", href: "/insights" },
  { id: "faq", href: "/faq" },
  { id: "process", href: "/process" },
];

/** Primary consult CTA (nav button + footer band). */
export const consultCta = {
  href: "/contact",
} as const;

export type LegalLink = {
  id: "privacy" | "terms";
  href: string;
};

export const legalLinks: LegalLink[] = [
  { id: "privacy", href: "/privacy" },
  { id: "terms", href: "/terms" },
];

export type ContactChannelKind =
  | "email"
  | "phone"
  | "telegram"
  | "whatsapp"
  | "instagram"
  | "github"
  | "linkedin";

export type ContactChannel = {
  id: ContactChannelKind;
  /** Display value, or TODO_REAL_DATA until confirmed. */
  value: string;
  /** Absolute or protocol URL when known. */
  href: string;
};

export const contactChannels: ContactChannel[] = [
  {
    id: "email",
    value: TODO_REAL_DATA,
    href: TODO_REAL_DATA,
  },
  {
    id: "phone",
    value: TODO_REAL_DATA,
    href: TODO_REAL_DATA,
  },
  {
    id: "telegram",
    value: TODO_REAL_DATA,
    href: TODO_REAL_DATA,
  },
  {
    id: "whatsapp",
    value: TODO_REAL_DATA,
    href: TODO_REAL_DATA,
  },
  {
    id: "instagram",
    value: TODO_REAL_DATA,
    href: TODO_REAL_DATA,
  },
  {
    id: "github",
    value: "github.com/karapardazavand",
    href: "https://github.com/karapardazavand",
  },
  {
    id: "linkedin",
    value: "linkedin.com/company/karapardazavand",
    href: "https://linkedin.com/company/karapardazavand",
  },
];

/** Office / mailing address — omitted from UI until confirmed. */
export const contactAddress = {
  value: TODO_REAL_DATA,
} as const;

export function isResolvedContact(
  channel: ContactChannel,
): channel is ContactChannel & { value: string; href: string } {
  return (
    channel.value !== TODO_REAL_DATA && channel.href !== TODO_REAL_DATA
  );
}

export function isResolvedAddress(): boolean {
  return contactAddress.value !== TODO_REAL_DATA;
}

export function getParentBrandUrl(): string {
  return (
    process.env.NEXT_PUBLIC_PARENT_BRAND_URL ?? "https://code1sprint.com"
  );
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
