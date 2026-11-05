import { z } from "zod";

export const TODO_REAL_DATA = "TODO_REAL_DATA";

export const ServiceEntitySchema = z.object({
  slug: z.string().min(1),
  name: z.object({
    fa: z.string().min(1),
    en: z.string().min(1),
  }),
  primaryKeyword: z.object({
    fa: z.string().min(1),
    en: z.string().min(1),
  }),
});

export const ContactSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  hours: z.string().optional(),
});

export const EntitySchema = z.object({
  canonicalName: z.object({
    fa: z.string().min(1),
    en: z.string().min(1),
  }),
  alternateNames: z.array(z.string()),
  definition: z.object({
    fa: z.string().min(10),
    en: z.string().min(10),
  }),
  url: z.string().url(),
  logo: z.object({
    square: z.string().url(),
    wide: z.string().url(),
  }),
  parentOrganization: z.object({
    name: z.string().min(1),
    url: z.string().url(),
  }),
  sameAs: z.array(z.string().url()),
  contact: ContactSchema,
  foundingDate: z.string().optional(),
  areaServed: z.array(z.string()),
  knowsAbout: z.array(z.string()),
  services: z.array(ServiceEntitySchema),
});

export type EntityConfig = z.infer<typeof EntitySchema>;

const rawEntityConfig: EntityConfig = {
  canonicalName: {
    fa: "کارا پرداز اوند",
    en: "Kara Pardaz Avand",
  },
  alternateNames: [
    "Kara Pardaz Oond",
    "کاراپردار اوند",
  ],
  definition: {
    fa: "کارا پرداز اوند (Kara Pardaz Avand) یک شرکت توسعه نرم‌افزار سازمانی است که CRM، ERP، سیستم‌های RAG و داشبورد داده را متناسب با فرایند هر سازمان می‌سازد.",
    en: "Kara Pardaz Avand is an enterprise software company that builds custom CRM, ERP, RAG systems and data dashboards fitted to each organization's processes.",
  },
  url: "https://karapardazavand.ir",
  logo: {
    square: "https://karapardazavand.ir/brand/logo.svg",
    wide: "https://karapardazavand.ir/brand/logo.svg",
  },
  parentOrganization: {
    name: "Code1Sprint",
    url: "https://code1sprint.com",
  },
  sameAs: [
    "https://linkedin.com/company/karapardazavand",
    "https://github.com/karapardazavand",
  ],
  contact: {
    email: undefined,
    phone: undefined,
    address: undefined,
    hours: undefined,
  },
  foundingDate: undefined,
  areaServed: ["Iran", "Worldwide"],
  knowsAbout: [
    "Custom Software Development",
    "Enterprise CRM",
    "Enterprise ERP",
    "Retrieval-Augmented Generation (RAG)",
    "Data Science & Dashboards",
    "Web Platforms & Systems",
  ],
  services: [
    {
      slug: "crm",
      name: {
        fa: "سیستم‌های CRM اختصاصی",
        en: "Custom CRM Systems",
      },
      primaryKeyword: {
        fa: "ساخت CRM اختصاصی برای سازمان‌ها",
        en: "Custom Enterprise CRM Development",
      },
    },
    {
      slug: "erp",
      name: {
        fa: "سیستم‌های ERP یکپارچه",
        en: "Custom ERP Systems",
      },
      primaryKeyword: {
        fa: "پیاده‌سازی ERP سفارشی",
        en: "Bespoke ERP Implementation",
      },
    },
    {
      slug: "rag-ai",
      name: {
        fa: "هوش مصنوعی و RAG سازمانی",
        en: "Enterprise RAG & AI",
      },
      primaryKeyword: {
        fa: "سیستم RAG سازمانی و چت‌بات روی اسناد",
        en: "Enterprise RAG AI and Document Chatbots",
      },
    },
    {
      slug: "data-science",
      name: {
        fa: "علم داده و داشبوردهای تحلیلی",
        en: "Data Science & Analytics Dashboards",
      },
      primaryKeyword: {
        fa: "داشبورد مدیریتی و علم داده",
        en: "Executive Dashboards and Data Science",
      },
    },
    {
      slug: "web-platforms",
      name: {
        fa: "وب‌سایت‌ها و پلتفرم‌های مقیاس‌پذیر",
        en: "Web Platforms & Portals",
      },
      primaryKeyword: {
        fa: "طراحی و توسعه وب‌سایت و پلتفرم سازمانی",
        en: "Enterprise Web Platform Design and Development",
      },
    },
    {
      slug: "custom-software",
      name: {
        fa: "توسعه نرم‌افزار سفارشی سازمانی",
        en: "Custom Enterprise Software",
      },
      primaryKeyword: {
        fa: "توسعه نرم‌افزار سفارشی سازمانی",
        en: "Custom Enterprise Software Engineering",
      },
    },
  ],
};

export const entityConfig = EntitySchema.parse(rawEntityConfig);

/**
 * Returns active contact field if confirmed real data, or undefined if absent/TODO.
 */
export function getActiveContact(field: keyof typeof entityConfig.contact): string | undefined {
  const value = entityConfig.contact[field];
  if (!value || value === TODO_REAL_DATA) {
    return undefined;
  }
  return value;
}
