import type { Service } from "@/lib/content";

export const customSoftwareService = {
  slug: "custom-software",
  title: {
    fa: "طراحی نرم‌افزار سفارشی",
    en: "Custom software design",
  },
  outcome: {
    fa: "سامانه‌ای متناسب با فرایند واقعی سازمان شما، نه قالب آماده.",
    en: "A system shaped around your real workflows—not a generic template.",
  },
  audience: [
    {
      fa: "سازمان‌هایی که فرایندشان در نرم‌افزارهای عمومی جا نمی‌گیرد.",
      en: "Organizations whose processes do not fit off-the-shelf tools.",
    },
    {
      fa: "تیم‌های عملیات و فناوری که به مالکیت کد و معماری شفاف نیاز دارند.",
      en: "Operations and technology teams that need code ownership and clear architecture.",
    },
    {
      fa: "کسب‌وکارهایی که می‌خواهند چند سیستم جزیره‌ای را در یک جریان واحد جمع کنند.",
      en: "Businesses that want to unify siloed systems into one coherent flow.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "تحلیل نیاز و مدل دامنه",
        en: "Requirements analysis and domain model",
      },
      description: {
        fa: "نقشهٔ موجودیت‌ها، قوانین کسب‌وکار و مرز سیستم با اولویت‌های روشن.",
        en: "Entity map, business rules, and system boundaries with clear priorities.",
      },
    },
    {
      title: {
        fa: "معماری قابل نگهداری",
        en: "Maintainable architecture",
      },
      description: {
        fa: "ساختار ماژول‌ها، قراردادهای API و انتخاب استک متناسب با مقیاس.",
        en: "Module structure, API contracts, and a stack suited to scale.",
      },
    },
    {
      title: {
        fa: "پیاده‌سازی مرحله‌ای",
        en: "Staged implementation",
      },
      description: {
        fa: "تحویل نسخهٔ قابل استفاده در هر مرحله، با بازخورد واقعی کاربران.",
        en: "A usable release at each stage, with real user feedback.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "آزمون و کنترل کیفیت",
        en: "Testing and quality control",
      },
      description: {
        fa: "پوشش مسیرهای اصلی، سناریوهای خطا و چک‌لیست پذیرش.",
        en: "Coverage of core paths, failure scenarios, and an acceptance checklist.",
      },
    },
    {
      title: {
        fa: "مستندات عملیاتی",
        en: "Operational documentation",
      },
      description: {
        fa: "راهنمای استقرار، اجرا و نگهداری برای تیم داخلی شما.",
        en: "Deploy, run, and maintain guides for your internal team.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "کشف و دامنه", en: "Discovery and scope" },
      description: {
        fa: "فرایند فعلی، محدودیت‌ها و معیار موفقیت را با ذی‌نفعان قفل می‌کنیم.",
        en: "We lock current processes, constraints, and success criteria with stakeholders.",
      },
    },
    {
      title: { fa: "معماری و نمونهٔ اولیه", en: "Architecture and prototype" },
      description: {
        fa: "اسکلت سیستم و یک جریان کلیدی را برای اعتبارسنجی زودهنگام می‌سازیم.",
        en: "We build the system skeleton and one key flow for early validation.",
      },
    },
    {
      title: { fa: "تحویل تکراری", en: "Iterative delivery" },
      description: {
        fa: "ماژول‌ها را با بازبینی منظم و معیار پذیرش مشخص تحویل می‌دهیم.",
        en: "We ship modules with regular reviews and explicit acceptance criteria.",
      },
      needs_business_confirmation: true,
    },
    {
      title: { fa: "استقرار و انتقال", en: "Launch and handoff" },
      description: {
        fa: "استقرار کنترل‌شده، آموزش تیم و مسیر پشتیبانی پس از تحویل.",
        en: "Controlled deployment, team training, and a post-delivery support path.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "فرانت و تجربه", en: "Front end & experience" },
      items: ["TypeScript", "Next.js", "React"],
    },
    {
      label: { fa: "بک‌اند و داده", en: "Backend & data" },
      items: ["Node.js", "PostgreSQL", "REST / GraphQL"],
    },
    {
      label: { fa: "اجرا و تحویل", en: "Runtime & delivery" },
      items: ["Docker", "CI/CD", "Observability"],
    },
  ],
  systemMap: {
    windowTitle: "kara://custom-software",
    layout: "hub",
    descriptionLead: {
      fa: "نرم‌افزار روی فرایند شما.",
      en: "Software on your process.",
    },
    description: {
      fa: "از نیاز تا استقرار، با مالکیت شفاف کد.",
      en: "From need to deploy, with clear code ownership.",
    },
    nodes: {
      inputTop: { fa: "نیاز و فرایند", en: "Needs & process" },
      inputBottom: { fa: "سیستم‌های موجود", en: "Existing systems" },
      core: { fa: "سامانهٔ سفارشی", en: "Custom system" },
      outputTop: { fa: "جریان کار عملیاتی", en: "Operational workflow" },
      outputBottom: { fa: "API و گزارش", en: "API & reports" },
    },
    logs: [
      { fa: "domain.modeled  entities=18", en: "domain.modeled  entities=18" },
      { fa: "module.shipped  name=orders", en: "module.shipped  name=orders" },
      { fa: "release.staged  env=staging", en: "release.staged  env=staging" },
    ],
  },
  faqs: [
    {
      id: "cs-fit",
      question: {
        fa: "چه زمانی نرم‌افزار سفارشی بهتر از محصول آماده است؟",
        en: "When is custom software better than an off-the-shelf product?",
      },
      answer: {
        fa: "وقتی فرایند شما مزیت رقابتی است یا یکپارچگی عمیق با سیستم‌های داخلی لازم است. اگر نیاز عمومی است، ابتدا محصول آماده را بررسی می‌کنیم.",
        en: "When your process is a competitive edge or deep internal integration is required. For generic needs, we review off-the-shelf options first.",
      },
    },
    {
      id: "cs-ownership",
      question: {
        fa: "مالکیت کد و مستندات چگونه است؟",
        en: "How do code and documentation ownership work?",
      },
      answer: {
        fa: "خروجی پروژه شامل کد منبع، مستندات استقرار و راهنمای نگهداری است. جزئیات حقوقی مالکیت در قرارداد مشخص می‌شود.",
        en: "Project output includes source code, deploy docs, and maintenance guides. Legal ownership details are set in the contract.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "cs-duration",
      question: {
        fa: "بازهٔ زمانی معمول چقدر است؟",
        en: "What is a typical timeline?",
      },
      answer: {
        fa: "بسته به دامنه، از چند هفته برای یک ماژول محدود تا چند ماه برای سامانهٔ چندماژوله. بازهٔ دقیق پس از کشف اعلام می‌شود.",
        en: "Depending on scope, from a few weeks for a bounded module to several months for a multi-module system. Exact range follows discovery.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "cs-team",
      question: {
        fa: "نقش تیم شما در طول پروژه چیست؟",
        en: "What is your team's role during the project?",
      },
      answer: {
        fa: "تصمیم‌گیر دامنه، بازبینی نسخه‌ها و دسترسی به داده و سیستم‌های موجود. بدون این همکاری، کیفیت تحویل افت می‌کند.",
        en: "Scope decisions, release reviews, and access to data and existing systems. Without that collaboration, delivery quality drops.",
      },
    },
  ],
  relatedProjects: [],
  bento: {
    order: 5,
    span: 6,
    dark: true,
    image: "/brand/bento/custom-software.svg",
    shortTitle: {
      fa: "نرم‌افزار سفارشی",
      en: "Custom software",
    },
  },
  needs_business_confirmation: true,
} as const satisfies Service;
