export interface SiteLinkItem {
  title: string;
  url: string;
  slug?: string;
  category: "main" | "services" | "projects" | "insights" | "legal";
  categoryLabel: string;
  description?: string;
}

export const STATIC_SITE_LINKS: SiteLinkItem[] = [
  // صفحات اصلی
  {
    title: "درخواست مشاوره و تماس",
    url: "/contact",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "فرم تماس و رزرو جلسه ارزیابی تخصصی",
  },
  {
    title: "درباره کارا پرداز آوند",
    url: "/about",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "معرفی تیم، رویکرد و بیانیه ماموریت",
  },
  {
    title: "کاتالوگ جامع خدمات نرم‌افزاری",
    url: "/services",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "فهرست راهکارها و تخصص‌های شرکت",
  },
  {
    title: "پایگاه دانش و مقالات تخصصی",
    url: "/insights",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "تحلیل‌ها و بینش‌های فنی و مدیریتی",
  },
  {
    title: "نمونه‌کارها و پروژه‌ها",
    url: "/portfolio",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "پایلوت‌ها و دستاوردهای پیاده‌سازی شده",
  },
  {
    title: "فرایند و متدولوژی همکاری",
    url: "/process",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "گام‌های از ارزیابی تا تحویل و پشتیبانی",
  },
  {
    title: "سوالات متداول (FAQ)",
    url: "/faq",
    category: "main",
    categoryLabel: "صفحه اصلی",
    description: "پاسخ به ابهامات فنی، امنیتی و مالی",
  },

  // خدمات و اسلاگ‌های خدمات
  {
    title: "سیستم‌های CRM سازمانی و پایپ‌لاین فروش",
    url: "/services/crm",
    slug: "crm",
    category: "services",
    categoryLabel: "خدمات",
    description: "سفارشی‌سازی و معماری جریان داده مشتریان",
  },
  {
    title: "سامانه‌های هوش مصنوعی سازمانی و RAG",
    url: "/services/rag-ai",
    slug: "rag-ai",
    category: "services",
    categoryLabel: "خدمات",
    description: "بازیابی دانش داخلی با حفظ محرمانگی داده‌ها",
  },
  {
    title: "علم داده، هوش تجاری و داشبوردهای تحلیلی",
    url: "/services/data-science",
    slug: "data-science",
    category: "services",
    categoryLabel: "خدمات",
    description: "تحلیل پیش‌بینانه و تبدیل داده به تصمیم عملیاتی",
  },
  {
    title: "سیستم‌های یکپارچه ERP و مدیریت منابع",
    url: "/services/erp",
    slug: "erp",
    category: "services",
    categoryLabel: "خدمات",
    description: "اتوماسیون مالی، انبار و فرایندهای سازمانی",
  },
  {
    title: "پلتفرم‌های وب و وب‌سایت‌های مقیاس‌پذیر",
    url: "/services/web-platforms",
    slug: "web-platforms",
    category: "services",
    categoryLabel: "خدمات",
    description: "معماری مدرن Next.js با تمرکز بر سرعت و سئو",
  },
  {
    title: "توسعه نرم‌افزارهای سفارشی عملیاتی",
    url: "/services/custom-software",
    slug: "custom-software",
    category: "services",
    categoryLabel: "خدمات",
    description: "طراحی ابزارهای متناسب با گلوگاه‌های بیزنس",
  },

  // پروژه‌ها و پایلوت‌ها
  {
    title: "پایلوت سیستم CRM عملیاتی",
    url: "/portfolio/ops-crm-pilot",
    slug: "ops-crm-pilot",
    category: "projects",
    categoryLabel: "نمونه‌کار",
    description: "یکپارچه‌سازی لیدها و مدیریت چرخه فروش",
  },
  {
    title: "پایلوت دستیار دانش‌بنیان RAG سازمانی",
    url: "/portfolio/rag-knowledge-pilot",
    slug: "rag-knowledge-pilot",
    category: "projects",
    categoryLabel: "نمونه‌کار",
    description: "پاسخ‌گویی سریع به اسناد و مستندات فنی",
  },

  // مقالات پیش‌فرض
  {
    title: "چک‌لیست انتخاب CRM: چه زمانی نرم‌افزار آماده شکست می‌خورد؟",
    url: "/insights/crm-fit",
    slug: "crm-fit",
    category: "insights",
    categoryLabel: "مقاله",
    description: "معیارهای تصمیم‌گیری بین خرید نرم‌افزار آماده یا توسعه سفارشی",
  },
  {
    title: "آمادگی سازمان برای RAG: آیا اسناد شما برای هوش مصنوعی آماده است؟",
    url: "/insights/rag-enterprise-readiness",
    slug: "rag-enterprise-readiness",
    category: "insights",
    categoryLabel: "مقاله",
    description: "پیش‌نیازهای کیفیت داده و متادیتا پیش از پیاده‌سازی مدل‌های زبانی",
  },
  {
    title: "پشته فناوری پیشنهادی برای سیستم‌های شرکتی در ایران (۱۴۰۴)",
    url: "/insights/iran-tech-stack-2026",
    slug: "iran-tech-stack-2026",
    category: "insights",
    categoryLabel: "مقاله",
    description: "بررسی زیرساخت‌های پایدار برای پلتفرم‌های ابری و سازمانی",
  },

  // حقوقی
  {
    title: "قوانین و شرایط استفاده از خدمات",
    url: "/terms",
    category: "legal",
    categoryLabel: "حقوقی",
    description: "شرایط همکاری و تعهدات متقابل",
  },
  {
    title: "سیاست حفظ محرمانگی و حریم خصوصی",
    url: "/privacy",
    category: "legal",
    categoryLabel: "حقوقی",
    description: "حفاظت از اطلاعات تجاری و محرمانگی داده‌ها",
  },
];
