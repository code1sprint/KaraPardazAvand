import type { Service } from "@/lib/content";

export const erpService = {
  slug: "erp",
  title: {
    fa: "ERP",
    en: "ERP",
  },
  outcome: {
    fa: "یکپارچه‌سازی عملیات، موجودی و مالی بر اساس فرایند واقعی سازمان.",
    en: "Operations, inventory, and finance aligned to how your organization actually works.",
  },
  audience: [
    {
      fa: "سازمان‌هایی که انبار، خرید و مالی روی دادهٔ مشترک کار نمی‌کنند.",
      en: "Organizations where warehouse, purchasing, and finance do not share one dataset.",
    },
    {
      fa: "تیم‌های عملیات که تأییدها و گردش کار دستی باعث تأخیر می‌شود.",
      en: "Operations teams slowed by manual approvals and workflows.",
    },
    {
      fa: "مدیرانی که به داشبورد سازمانی قابل اتکا نیاز دارند.",
      en: "Managers who need a reliable organizational dashboard.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "نقشهٔ فرایند و مرز ماژول‌ها",
        en: "Process map and module boundaries",
      },
      description: {
        fa: "اولویت ماژول‌ها و نقاط یکپارچگی با سیستم‌های موجود.",
        en: "Module priorities and integration points with existing systems.",
      },
    },
    {
      title: {
        fa: "ماژول‌های اولویت‌دار",
        en: "Priority modules",
      },
      description: {
        fa: "تحویل عملیاتی ماژول‌هایی که بیشترین گلوگاه را باز می‌کنند.",
        en: "Operational delivery of modules that unlock the biggest bottlenecks.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "گردش کار تأیید",
        en: "Approval workflow",
      },
      description: {
        fa: "مسیر تأیید چندمرحله‌ای با ردگیری وضعیت و مسئول.",
        en: "Multi-step approvals with status tracking and clear owners.",
      },
    },
    {
      title: {
        fa: "گزارش‌گیری و کنترل دسترسی",
        en: "Reporting and access control",
      },
      description: {
        fa: "گزارش‌های نقش‌محور و مسیر حسابرسی رویدادهای حساس.",
        en: "Role-based reports and an audit trail for sensitive events.",
      },
    },
    {
      title: {
        fa: "مهاجرت دادهٔ کنترل‌شده",
        en: "Controlled data migration",
      },
      description: {
        fa: "نگاشت، پاکسازی و انتقال مرحله‌ای از سامانه‌های قبلی.",
        en: "Mapping, cleanup, and staged transfer from prior systems.",
      },
      needs_business_confirmation: true,
    },
  ],
  steps: [
    {
      title: { fa: "نقشهٔ عملیات", en: "Operations map" },
      description: {
        fa: "فرایندهای انبار، خرید و مالی را با گلوگاه‌ها مستند می‌کنیم.",
        en: "We document warehouse, purchasing, and finance processes with bottlenecks.",
      },
    },
    {
      title: { fa: "طراحی ماژول‌ها", en: "Module design" },
      description: {
        fa: "مرز ماژول‌ها، مدل دادهٔ مشترک و قوانین تأیید را تعریف می‌کنیم.",
        en: "We define module boundaries, a shared data model, and approval rules.",
      },
    },
    {
      title: { fa: "تحویل ماژول‌به‌ماژول", en: "Module-by-module delivery" },
      description: {
        fa: "هر ماژول با معیار پذیرش و دادهٔ واقعی آزمایش می‌شود.",
        en: "Each module is tested against acceptance criteria and real data.",
      },
    },
    {
      title: { fa: "یکپارچگی و استقرار", en: "Integration and go-live" },
      description: {
        fa: "اتصال ماژول‌ها، مهاجرت نهایی و پشتیبانی دورهٔ تثبیت.",
        en: "Module wiring, final migration, and stabilization support.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "هسته", en: "Core" },
      items: ["TypeScript", "PostgreSQL", "Message queue"],
    },
    {
      label: { fa: "حاکمیت", en: "Governance" },
      items: ["Audit log", "RBAC", "Background jobs"],
    },
  ],
  systemMap: {
    windowTitle: "kara://erp",
    layout: "modules",
    descriptionLead: {
      fa: "یکپارچگی فرایندها.",
      en: "Process integration.",
    },
    description: {
      fa: "انبار، خرید و مالی روی یک داده مشترک.",
      en: "Warehouse, purchasing, and finance on one shared dataset.",
    },
    nodes: {
      inputTop: { fa: "انبار و خرید", en: "Warehouse & purchasing" },
      inputBottom: { fa: "مالی و حسابداری", en: "Finance & accounting" },
      core: { fa: "ERP", en: "ERP" },
      outputTop: { fa: "گردش کار تأیید", en: "Approval workflow" },
      outputBottom: { fa: "داشبورد سازمانی", en: "Org dashboard" },
    },
    logs: [
      { fa: "stock.updated  sku=A-1042", en: "stock.updated  sku=A-1042" },
      { fa: "invoice.matched  po=3381", en: "invoice.matched  po=3381" },
      { fa: "approval.requested", en: "approval.requested" },
    ],
  },
  faqs: [
    {
      id: "erp-scope",
      question: {
        fa: "آیا کل ERP را یکجا می‌سازید؟",
        en: "Do you build a full ERP all at once?",
      },
      answer: {
        fa: "خیر؛ معمولاً ماژول‌به‌ماژول و بر اساس بیشترین درد عملیاتی پیش می‌رویم تا ریسک و زمان تا ارزش کم بماند.",
        en: "No—we usually proceed module by module against the biggest operational pain so risk and time-to-value stay lower.",
      },
    },
    {
      id: "erp-accounting",
      question: {
        fa: "آیا جایگزین نرم‌افزار حسابداری می‌شوید؟",
        en: "Do you replace the accounting system?",
      },
      answer: {
        fa: "بسته به دامنه؛ گاهی یکپارچگی با سامانهٔ مالی موجود کافی است. جایگزینی کامل فقط با تأیید صریح دامنه.",
        en: "Depends on scope; integrating with an existing finance system is often enough. Full replacement only with explicit scope approval.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "erp-change",
      question: {
        fa: "تغییر فرایند سازمانی چقدر لازم است؟",
        en: "How much process change is required?",
      },
      answer: {
        fa: "هدف تطبیق سیستم با فرایند واقعی است؛ جایی که فرایند مبهم است، ابتدا آن را روشن می‌کنیم نه اینکه نرم‌افزار را پیچیده کنیم.",
        en: "The goal is fitting the system to real process; where process is unclear, we clarify it first rather than overcomplicating software.",
      },
    },
  ],
  relatedProjects: [],
  bento: {
    order: 3,
    span: 2,
    image: "/brand/bento/erp.svg",
    shortTitle: { fa: "ERP", en: "ERP" },
  },
  needs_business_confirmation: true,
} as const satisfies Service;
