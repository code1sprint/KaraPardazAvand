import type { Service } from "@/lib/content";

export const crmService = {
  slug: "crm",
  title: {
    fa: "CRM",
    en: "CRM",
  },
  outcome: {
    fa: "پیگیری مشتری و فروش در یک جریان شفاف برای تیم شما.",
    en: "Customer and sales tracking in one clear flow for your team.",
  },
  audience: [
    {
      fa: "تیم‌های فروش که سرنخ‌ها بین اکسل، پیام‌رسان و ایمیل گم می‌شوند.",
      en: "Sales teams whose leads get lost across spreadsheets, messengers, and email.",
    },
    {
      fa: "مدیران عملیات که به قیف شفاف و گزارش مدیریتی نیاز دارند.",
      en: "Operations managers who need a clear pipeline and management reports.",
    },
    {
      fa: "سازمان‌هایی که می‌خواهند کانال‌های ورودی را به یک مدل مخاطب وصل کنند.",
      en: "Organizations that want inbound channels tied to one contact model.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "مدل مخاطب، فرصت و فعالیت",
        en: "Contact, opportunity, and activity model",
      },
      description: {
        fa: "تعریف موجودیت‌ها، وضعیت‌ها و قوانین تخصیص مالک.",
        en: "Entities, statuses, and ownership assignment rules.",
      },
    },
    {
      title: {
        fa: "قیف فروش قابل پیکربندی",
        en: "Configurable sales pipeline",
      },
      description: {
        fa: "مراحل، معیارهای انتقال و نمای کانبان برای تیم.",
        en: "Stages, transition criteria, and a team kanban view.",
      },
    },
    {
      title: {
        fa: "داشبورد وضعیت",
        en: "Status dashboard",
      },
      description: {
        fa: "نمای مدیریتی از ورودی، تبدیل و بار کاری تیم.",
        en: "Management view of intake, conversion, and team load.",
      },
    },
    {
      title: {
        fa: "اتصال کانال‌های ارتباطی",
        en: "Communication channel integrations",
      },
      description: {
        fa: "ثبت رویداد از وب‌سایت، تماس یا پیام‌رسان‌های مورد توافق.",
        en: "Event capture from the website, calls, or agreed messengers.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "کنترل دسترسی نقش‌محور",
        en: "Role-based access control",
      },
      description: {
        fa: "مرز دید داده‌ها برای فروش، پشتیبانی و مدیریت.",
        en: "Data visibility boundaries for sales, support, and management.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "هم‌راستایی قیف", en: "Pipeline alignment" },
      description: {
        fa: "مراحل فروش واقعی و تعریف «فرصت موفق» را با تیم شما قفل می‌کنیم.",
        en: "We lock real sales stages and the definition of a won opportunity with your team.",
      },
    },
    {
      title: { fa: "مدل داده و نقش‌ها", en: "Data model and roles" },
      description: {
        fa: "مخاطب، فرصت، فعالیت و سطح دسترسی هر نقش را طراحی می‌کنیم.",
        en: "We design contact, opportunity, activity, and per-role access.",
      },
    },
    {
      title: { fa: "ساخت و اتصال", en: "Build and connect" },
      description: {
        fa: "قیف، داشبورد و یکپارچه‌سازی کانال‌های اولویت‌دار را تحویل می‌دهیم.",
        en: "We deliver the pipeline, dashboard, and priority channel integrations.",
      },
    },
    {
      title: { fa: "آزمون میدانی و انتقال", en: "Field test and handoff" },
      description: {
        fa: "با کاربران واقعی می‌سنجیم، آموزش می‌دهیم و مسیر پشتیبانی را مشخص می‌کنیم.",
        en: "We validate with real users, train the team, and define the support path.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "برنامه", en: "Application" },
      items: ["TypeScript", "Next.js", "PostgreSQL"],
    },
    {
      label: { fa: "یکپارچه‌سازی", en: "Integration" },
      items: ["REST / GraphQL", "Webhooks", "Role-based access"],
    },
  ],
  systemMap: {
    windowTitle: "kara://crm",
    layout: "funnel",
    descriptionLead: {
      fa: "مدیریت ارتباط با مشتری.",
      en: "Customer relationship management.",
    },
    description: {
      fa: "همه کانال‌ها در یک‌جا و هر سرنخ در مسیر درست.",
      en: "All channels in one place, every lead on the right path.",
    },
    nodes: {
      inputTop: { fa: "سایت و شبکه‌ها", en: "Site & networks" },
      inputBottom: { fa: "تماس و پیام‌رسان", en: "Calls & messengers" },
      core: { fa: "CRM", en: "CRM" },
      outputTop: { fa: "پیگیری و فروش", en: "Follow-up & sales" },
      outputBottom: { fa: "گزارش مدیریتی", en: "Management reports" },
    },
    logs: [
      { fa: "lead.created  source=website", en: "lead.created  source=website" },
      {
        fa: "lead.assigned  owner=sales/2",
        en: "lead.assigned  owner=sales/2",
      },
      { fa: "followup.scheduled  +24h", en: "followup.scheduled  +24h" },
    ],
  },
  faqs: [
    {
      id: "crm-vs-ready",
      question: {
        fa: "CRM سفارشی یا محصول آماده؟",
        en: "Custom CRM or an off-the-shelf product?",
      },
      answer: {
        fa: "اگر فرایند فروش شما ساده است، محصول آماده ممکن است کافی باشد. وقتی قیف، نقش‌ها یا یکپارچگی خاص دارید، مسیر سفارشی یا ترکیبی را پیشنهاد می‌کنیم.",
        en: "If your sales process is simple, an off-the-shelf product may suffice. With specific pipelines, roles, or integrations, we suggest custom or hybrid.",
      },
    },
    {
      id: "crm-migrate",
      question: {
        fa: "داده‌های فعلی فروش را منتقل می‌کنید؟",
        en: "Do you migrate existing sales data?",
      },
      answer: {
        fa: "بله؛ پس از پاکسازی و نگاشت فیلدها. کیفیت دادهٔ مبدأ روی زمان و دقت مهاجرت اثر مستقیم دارد.",
        en: "Yes—after cleanup and field mapping. Source data quality directly affects migration time and accuracy.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "crm-mobile",
      question: {
        fa: "آیا نسخهٔ موبایل هم دارید؟",
        en: "Is there a mobile experience?",
      },
      answer: {
        fa: "رابط وب واکنش‌گرا بخشی از تحویل است. اپلیکیشن بومی فقط در صورت تعریف در دامنه پروژه.",
        en: "A responsive web UI is part of delivery. A native app only if defined in project scope.",
      },
    },
    {
      id: "crm-support",
      question: {
        fa: "پس از راه‌اندازی چه پشتیبانی دارید؟",
        en: "What support do you offer after launch?",
      },
      answer: {
        fa: "پشتیبانی و بهبود ماهانه قابل تعریف است؛ سطح خدمت در قرارداد مشخص می‌شود.",
        en: "Monthly support and improvement can be defined; service level is set in the contract.",
      },
      needs_business_confirmation: true,
    },
  ],
  relatedProjects: ["ops-crm-pilot"],
  bento: {
    order: 0,
    span: 4,
    image: "/brand/bento/crm.svg",
    shortTitle: { fa: "CRM", en: "CRM" },
  },
} as const satisfies Service;
