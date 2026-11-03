import type { Service } from "@/lib/content";

export const webPlatformsService = {
  slug: "web-platforms",
  title: {
    fa: "وب‌سایت و پلتفرم وب",
    en: "Websites and web platforms",
  },
  outcome: {
    fa: "حضور وب سریع، در دسترس و قابل توسعه برای رشد محتوا و محصول.",
    en: "A fast, accessible web presence that can grow with content and product.",
  },
  audience: [
    {
      fa: "برندهایی که به سایت چندزبانه، سئو پایه و انتشار منظم محتوا نیاز دارند.",
      en: "Brands that need a multilingual site, foundational SEO, and steady content publishing.",
    },
    {
      fa: "تیم‌های محصول که پلتفرم وب را نقطهٔ ورود به سرویس‌های داخلی می‌بینند.",
      en: "Product teams that treat the web platform as the entry point to internal services.",
    },
    {
      fa: "سازمان‌هایی که پنل محتوا یا اتصال پرداخت و سرویس‌های جانبی می‌خواهند.",
      en: "Organizations that need a content admin or payment and side-service integrations.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "طراحی رابط و تجربه",
        en: "UI and experience design",
      },
      description: {
        fa: "ساختار صفحات، مسیر کاربر و الگوی بصری هم‌راستا با برند.",
        en: "Page structure, user paths, and a visual system aligned with the brand.",
      },
    },
    {
      title: {
        fa: "پیاده‌سازی سریع و دسترس‌پذیر",
        en: "Fast, accessible implementation",
      },
      description: {
        fa: "فرانت مدرن با تمرکز روی Core Web Vitals و پشتیبانی صفحه‌کلید.",
        en: "Modern front end focused on Core Web Vitals and keyboard support.",
      },
    },
    {
      title: {
        fa: "چندزبانه و سئو پایه",
        en: "Multilingual and foundational SEO",
      },
      description: {
        fa: "مسیرهای محلی‌سازی، متادیتا و ساختار URL قابل ایندکس.",
        en: "Localization routes, metadata, and indexable URL structure.",
      },
    },
    {
      title: {
        fa: "پنل محتوا یا اتصال سیستم",
        en: "Content admin or system integration",
      },
      description: {
        fa: "انتشار محتوا توسط تیم شما، یا اتصال به CMS و سرویس‌های موجود.",
        en: "Publishing by your team, or connection to an existing CMS and services.",
      },
    },
    {
      title: {
        fa: "استقرار و مانیتورینگ",
        en: "Deploy and monitoring",
      },
      description: {
        fa: "خط لولهٔ انتشار، پشتیبان‌گیری و دید اولیه روی خطاها.",
        en: "Release pipeline, backups, and initial visibility into errors.",
      },
      needs_business_confirmation: true,
    },
  ],
  steps: [
    {
      title: { fa: "اهداف و نقشهٔ محتوا", en: "Goals and content map" },
      description: {
        fa: "مخاطب، پیام اصلی و فهرست صفحات اولویت‌دار را مشخص می‌کنیم.",
        en: "We define audience, core message, and a prioritized page list.",
      },
    },
    {
      title: { fa: "طراحی و پروتوتایپ", en: "Design and prototype" },
      description: {
        fa: "قالب‌های کلیدی را قبل از پیاده‌سازی کامل اعتبارسنجی می‌کنیم.",
        en: "We validate key templates before full implementation.",
      },
    },
    {
      title: { fa: "ساخت و یکپارچه‌سازی", en: "Build and integrate" },
      description: {
        fa: "صفحات، فرم‌ها و اتصال‌های لازم را مرحله‌به‌مرحله تحویل می‌دهیم.",
        en: "We ship pages, forms, and required integrations in stages.",
      },
    },
    {
      title: { fa: "انتشار و بهینه‌سازی", en: "Launch and optimize" },
      description: {
        fa: "انتشار کنترل‌شده، بررسی عملکرد و مسیر بهبود پس از لانچ.",
        en: "Controlled launch, performance review, and a post-launch improvement path.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "فرانت", en: "Front end" },
      items: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      label: { fa: "محتوا", en: "Content" },
      items: ["MDX", "CMS adapters", "next-intl"],
    },
    {
      label: { fa: "تحویل", en: "Delivery" },
      items: ["CDN", "CI/CD", "Analytics hooks"],
    },
  ],
  systemMap: {
    windowTitle: "kara://web-platforms",
    layout: "stack",
    descriptionLead: {
      fa: "پلتفرم وب سریع و قابل مدیریت.",
      en: "A fast, manageable web platform.",
    },
    description: {
      fa: "سئو و سرویس‌ها از ابتدا در معماری.",
      en: "SEO and services built into the architecture from day one.",
    },
    nodes: {
      inputTop: { fa: "محتوا و سئو", en: "Content & SEO" },
      inputBottom: { fa: "پرداخت و سرویس‌ها", en: "Payments & services" },
      core: { fa: "پلتفرم وب", en: "Web platform" },
      outputTop: { fa: "وب‌سایت سریع", en: "Fast website" },
      outputBottom: { fa: "پنل مدیریت", en: "Admin panel" },
    },
    logs: [
      { fa: "build.passed  lcp=1.4s", en: "build.passed  lcp=1.4s" },
      { fa: "deploy.live", en: "deploy.live" },
      { fa: "admin.published", en: "admin.published" },
    ],
  },
  faqs: [
    {
      id: "web-cms",
      question: {
        fa: "آیا پنل مدیریت محتوا هم می‌سازید؟",
        en: "Do you also build a content admin?",
      },
      answer: {
        fa: "بسته به نیاز، یا پنل سبک سفارشی می‌سازیم یا به CMS موجود متصل می‌کنیم. انتخاب روی هزینهٔ نگهداری و مهارت تیم شما است.",
        en: "Depending on need, we build a light custom admin or connect an existing CMS. The choice follows maintenance cost and your team's skills.",
      },
    },
    {
      id: "web-seo",
      question: {
        fa: "سئو تا چه حد در محدودهٔ پروژه است؟",
        en: "How much SEO is in project scope?",
      },
      answer: {
        fa: "ساختار فنی سئو (متادیتا، نقشهٔ سایت، سرعت، مسیرهای محلی) بخشی از تحویل است. استراتژی محتوا و لینک‌سازی خارج از محدودهٔ پیش‌فرض است مگر توافق شود.",
        en: "Technical SEO (metadata, sitemap, speed, locale routes) is part of delivery. Content strategy and link building are out of default scope unless agreed.",
      },
    },
    {
      id: "web-migrate",
      question: {
        fa: "انتقال از سایت فعلی چگونه انجام می‌شود؟",
        en: "How does migration from an existing site work?",
      },
      answer: {
        fa: "محتوای اولویت‌دار، ریدایرکت‌ها و چک‌لیست انتشار را برنامه‌ریزی می‌کنیم تا افت ایندکس به حداقل برسد.",
        en: "We plan priority content, redirects, and a launch checklist to minimize index loss.",
      },
      needs_business_confirmation: true,
    },
  ],
  relatedProjects: [],
  bento: {
    order: 4,
    span: 2,
    image: "/brand/bento/web-platforms.svg",
    shortTitle: {
      fa: "وب‌سایت و پلتفرم",
      en: "Websites and platforms",
    },
  },
} as const satisfies Service;
