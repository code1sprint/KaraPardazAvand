import { z } from "zod";
import { entityConfig } from "@/lib/seo/entity";

export const RouteSeoMetaItemSchema = z.object({
  route: z.string(),
  locale: z.enum(["fa", "en"]),
  title: z.string().min(30).max(60),
  description: z.string().min(120).max(158),
  ogTitle: z.string().min(10).max(70),
  ogDescription: z.string().min(60).max(160),
  ogImageText: z.object({
    line1: z.string().min(5).max(60),
    line2: z.string().max(40).optional(),
  }),
  primaryKeyword: z.string().min(3),
  secondaryKeywords: z.array(z.string()).min(2).max(3),
  robots: z.string().default("index, follow"),
  rationale: z.string().min(10),
});

export type RouteSeoMetaItem = z.infer<typeof RouteSeoMetaItemSchema>;

export const noIndexRules = {
  patterns: ["/404", "/thank-you", "/admin/*", "/preview/*", "/search/*"],
  robots: "noindex, nofollow",
  rationale: "Utility, preview, private administration, and duplicate search result pages are blocked from indexing.",
};

const brandFa = entityConfig.canonicalName.fa; // "کارا پرداز اوند"
const brandEn = entityConfig.canonicalName.en; // "Kara Pardaz Avand"

export const routeSeoMetaCollection: RouteSeoMetaItem[] = [
  // -------------------------------------------------------------
  // HOME (/)
  // -------------------------------------------------------------
  {
    route: "/",
    locale: "fa",
    title: `${brandFa} | توسعه نرم‌افزار سازمانی، CRM، ERP و RAG`,
    description: `کارا پرداز اوند در زمینه توسعه نرم‌افزار سازمانی، سامانه‌های CRM و ERP اختصاصی برای سازمان‌ها فعالیت می‌کند. برای بررسی فرایندها مشاوره دریافت کنید.`,
    ogTitle: `${brandFa} | مهندسی نرم‌افزار سازمانی و سامانه‌های یکپارچه`,
    ogDescription: `طراحی و ساخت نرم‌افزار اختصاصی سازمانی، CRM، ERP، سیستم‌های RAG و داشبورد مدیریتی داده.`,
    ogImageText: {
      line1: "توسعه نرم‌افزار سازمانی و سامانه‌های یکپارچه",
      line2: "کارا پرداز اوند — راهکارهای اختصاصی",
    },
    primaryKeyword: "توسعه نرم‌افزار سازمانی",
    secondaryKeywords: ["CRM اختصاصی", "سامانه ERP", "هوش مصنوعی سازمانی"],
    robots: "index, follow",
    rationale: "صفحه اصلی هویت رسمی شرکت و حوزه‌های نرم‌افزار سازمانی، CRM و ERP را برجسته می‌کند.",
  },
  {
    route: "/",
    locale: "en",
    title: `${brandEn} | Enterprise Software, CRM, ERP & RAG`,
    description: `Kara Pardaz Avand delivers enterprise software, bespoke CRM platforms, and ERP systems for growing organizations. Request an engineering consultation.`,
    ogTitle: `${brandEn} | Enterprise Software & Bespoke Systems`,
    ogDescription: `Custom enterprise software engineering, CRM, ERP, grounded RAG AI, and management dashboards.`,
    ogImageText: {
      line1: "Enterprise Software & Bespoke Systems",
      line2: "Kara Pardaz Avand — Software Engineering",
    },
    primaryKeyword: "enterprise software",
    secondaryKeywords: ["custom CRM systems", "bespoke ERP", "enterprise RAG AI"],
    robots: "index, follow",
    rationale: "Homepage introduces company identity, core enterprise services, and consultation call-to-action.",
  },

  // -------------------------------------------------------------
  // SERVICES LIST (/services)
  // -------------------------------------------------------------
  {
    route: "/services",
    locale: "fa",
    title: `خدمات نرم‌افزاری سازمانی | ${brandFa}`,
    description: `معرفی خدمات نرم‌افزاری سازمانی شامل توسعه سامانه، پلتفرم‌های وب، CRM، ERP، هوش مصنوعی RAG و داشبورد داده در کارا پرداز اوند. دریافت مشاوره فنی.`,
    ogTitle: `خدمات نرم‌افزاری سازمانی | ${brandFa}`,
    ogDescription: `شش حوزه تخصصی همکاری؛ از توسعه سامانه اختصاصی و CRM تا هوش مصنوعی RAG و داشبورد داده.`,
    ogImageText: {
      line1: "خدمات نرم‌افزاری سازمانی",
      line2: "شش حوزه تخصصی توسعه نرم‌افزار",
    },
    primaryKeyword: "خدمات نرم‌افزاری سازمانی",
    secondaryKeywords: ["توسعه سامانه سفارشی", "پیاده‌سازی CRM و ERP", "پلتفرم وب سازمانی"],
    robots: "index, follow",
    rationale: "صفحه فهرست خدمات تمامی حوزه‌های فنی همکاری را با هدف جستجوی کاتالوگ خدمات معرفی می‌کند.",
  },
  {
    route: "/services",
    locale: "en",
    title: `Enterprise Software Services | ${brandEn}`,
    description: `Explore enterprise software services covering custom systems, web platforms, CRM, ERP, RAG AI, and dashboards at Kara Pardaz Avand. Request a consult.`,
    ogTitle: `Enterprise Software Services | ${brandEn}`,
    ogDescription: `Six core software development capabilities tailored to enterprise operations and modern business workflows.`,
    ogImageText: {
      line1: "Enterprise Software Services",
      line2: "Core Engineering Capabilities",
    },
    primaryKeyword: "enterprise software services",
    secondaryKeywords: ["custom software development", "enterprise web platforms", "data dashboards"],
    robots: "index, follow",
    rationale: "Services catalog page detailing our six core technical offerings for organizations.",
  },

  // -------------------------------------------------------------
  // SERVICE: CRM (/services/crm)
  // -------------------------------------------------------------
  {
    route: "/services/crm",
    locale: "fa",
    title: `ساخت CRM اختصاصی برای سازمان‌ها | ${brandFa}`,
    description: `طراحی و ساخت CRM اختصاصی برای سازمان‌ها متناسب با قیف فروش و گردش کارهای پیگیری، با اتصال به سیستم مالی و مرکز تلفن. درخواست مشاوره تخصصی.`,
    ogTitle: `ساخت CRM اختصاصی برای سازمان‌ها | ${brandFa}`,
    ogDescription: `ساماندهی پایپ‌لاین فروش، گردش کارهای اتوماتیک پیگیری و اتصال به نرم‌افزارهای مالی بدون لایسنس.`,
    ogImageText: {
      line1: "ساخت CRM اختصاصی برای سازمان‌ها",
      line2: "ساماندهی پایپ‌لاین فروش و پیگیری",
    },
    primaryKeyword: "ساخت CRM اختصاصی برای سازمان‌ها",
    secondaryKeywords: ["اتوماسیون فروش B2B", "یکپارچه‌سازی با نرم‌افزار مالی", "مدیریت ارتباط با مشتری"],
    robots: "index, follow",
    rationale: "صفحه خدمت CRM بر کلمه کلیدی ساخت CRM اختصاصی و حل معضل سرنخ‌های پراکنده تمرکز دارد.",
  },
  {
    route: "/services/crm",
    locale: "en",
    title: `Custom CRM Development | ${brandEn}`,
    description: `End-to-end custom CRM development designed around operational workflows, pipeline tracking, and telephony integrations. Request a consultation.`,
    ogTitle: `Custom CRM Development | ${brandEn}`,
    ogDescription: `Convert scattered leads into predictable revenue with tailored sales pipeline architecture and ERP integration.`,
    ogImageText: {
      line1: "Custom CRM Development",
      line2: "Sales Pipeline & Operations Architecture",
    },
    primaryKeyword: "custom CRM development",
    secondaryKeywords: ["B2B sales automation", "ERP CRM integration", "bespoke sales engine"],
    robots: "index, follow",
    rationale: "Custom CRM service page targeting decision-makers seeking bespoke sales pipelines over SaaS seat licenses.",
  },

  // -------------------------------------------------------------
  // SERVICE: ERP (/services/erp)
  // -------------------------------------------------------------
  {
    route: "/services/erp",
    locale: "fa",
    title: `پیاده‌سازی ERP سفارشی | ${brandFa}`,
    description: `پیاده‌سازی ERP سفارشی برای هماهنگی فرآیندهای مالی، انبارداری و زنجیره تأمین بدون هزینه‌های لایسنس مداوم سازمانی. گفت‌وگو با کارشناسان ما.`,
    ogTitle: `پیاده‌سازی ERP سفارشی سازمانی | ${brandFa}`,
    ogDescription: `یکپارچه‌سازی فرآیندهای انبار، تدارکات، فروش و حسابداری متناسب با روش‌های کاری سازمان.`,
    ogImageText: {
      line1: "پیاده‌سازی ERP سفارشی سازمانی",
      line2: "یکپارچگی انبار، مالی و تدارکات",
    },
    primaryKeyword: "پیاده‌سازی ERP سفارشی",
    secondaryKeywords: ["نرم‌افزار برنامه‌ریزی منابع", "یکپارچگی انبار و مالی", "سامانه مدیریت زنجیره تأمین"],
    robots: "index, follow",
    rationale: "خدمت ERP نیاز سازمان‌ها به سامانه جامع مدیریت منابع متناسب با فرآیندهای واقعی را هدف می‌گیرد.",
  },
  {
    route: "/services/erp",
    locale: "en",
    title: `Custom ERP Implementation | ${brandEn}`,
    description: `Full-scope custom ERP implementation unifying supply chain, inventory, and accounting workflows for growing companies. Request a consultation.`,
    ogTitle: `Custom ERP Implementation | ${brandEn}`,
    ogDescription: `Tailored enterprise resource planning systems built for complex operations without recurring user seat licenses.`,
    ogImageText: {
      line1: "Custom ERP Implementation",
      line2: "Unified Enterprise Workflows",
    },
    primaryKeyword: "custom ERP implementation",
    secondaryKeywords: ["bespoke enterprise ERP", "inventory workflow systems", "supply chain integration"],
    robots: "index, follow",
    rationale: "Targeting operations managers seeking bespoke enterprise resource planning without vendor lock-in.",
  },

  // -------------------------------------------------------------
  // SERVICE: RAG AI (/services/rag-ai)
  // -------------------------------------------------------------
  {
    route: "/services/rag-ai",
    locale: "fa",
    title: `سیستم RAG سازمانی و چت‌بات روی اسناد | ${brandFa}`,
    description: `طراحی سیستم RAG سازمانی و چت‌بات روی اسناد داخلی با استناد به منابع متنی و بدون خطر نشت اطلاعات محرمانه. برای بررسی امکان‌سنجی پیام دهید.`,
    ogTitle: `سیستم RAG سازمانی و هوش مصنوعی | ${brandFa}`,
    ogDescription: `پاسخگویی آنی و مستند به پرسش‌های سازمانی با اتصال ایمن مدل‌های زبانی به اسناد و پایگاه‌های دانش.`,
    ogImageText: {
      line1: "سیستم RAG سازمانی و چت‌بات روی اسناد",
      line2: "هوش مصنوعی با استناد به داده‌های داخلی",
    },
    primaryKeyword: "سیستم RAG سازمانی و چت‌بات روی اسناد",
    secondaryKeywords: ["هوش مصنوعی اسناد داخلی", "چت‌بات سازمانی بدون خطا", "جستجوی معنایی اسناد"],
    robots: "index, follow",
    rationale: "تاکید بر هوش مصنوعی قابل استناد و محرمانه روی اسناد داخلی شرکت‌ها و سازمان‌ها.",
  },
  {
    route: "/services/rag-ai",
    locale: "en",
    title: `Enterprise RAG System | ${brandEn}`,
    description: `Deploy an enterprise RAG system with strict access controls, verifiable document citations, and private AI infrastructure. Request a technical pilot.`,
    ogTitle: `Enterprise RAG System & AI | ${brandEn}`,
    ogDescription: `Grounded enterprise retrieval-augmented generation delivering verifiable answers from internal corporate documents.`,
    ogImageText: {
      line1: "Enterprise RAG System & AI",
      line2: "Verifiable Chatbots Over Documents",
    },
    primaryKeyword: "enterprise RAG system",
    secondaryKeywords: ["internal document chatbot", "grounded RAG architecture", "enterprise AI search"],
    robots: "index, follow",
    rationale: "Focused on enterprise CTOs requiring verifiable, permission-aware RAG systems without hallucination.",
  },

  // -------------------------------------------------------------
  // SERVICE: DATA SCIENCE (/services/data-science)
  // -------------------------------------------------------------
  {
    route: "/services/data-science",
    locale: "fa",
    title: `داشبورد مدیریتی و علم داده | ${brandFa}`,
    description: `توسعه داشبورد مدیریتی و علم داده برای تجمیع داده‌های پراکنده و ارائه شاخص‌های بلادرنگ تصمیم‌گیری به مدیران سازمان. درخواست دموی تحلیلی.`,
    ogTitle: `داشبورد مدیریتی و علم داده | ${brandFa}`,
    ogDescription: `تبدیل داده‌های پراکنده به اتاق کنترل مدیریتی زنده و گزارش‌های تحلیلی اتوماتیک برای مدیران ارشد.`,
    ogImageText: {
      line1: "داشبورد مدیریتی و علم داده",
      line2: "اتاق کنترل تصمیم‌گیری و شاخص‌های زنده",
    },
    primaryKeyword: "داشبورد مدیریتی و علم داده",
    secondaryKeywords: ["شاخص‌های کلیدی عملکرد", "تحلیل پیش‌بینانه داده", "اتاق فرمان مدیریتی"],
    robots: "index, follow",
    rationale: "پاسخ به جستجوی مدیران برای تجمیع داده‌ها و ساخت داشبوردهای تحلیلی تحت وب.",
  },
  {
    route: "/services/data-science",
    locale: "en",
    title: `Management Dashboards & Data Science | ${brandEn}`,
    description: `Deploy actionable management dashboards and data science pipelines to monitor organizational KPIs and trends in real time. Request a consultation.`,
    ogTitle: `Management Dashboards & Analytics | ${brandEn}`,
    ogDescription: `Turn fragmented business metrics into live executive command centers for confident data-backed decisions.`,
    ogImageText: {
      line1: "Management Dashboards & Analytics",
      line2: "Real-Time Operational Intelligence",
    },
    primaryKeyword: "management dashboards and data science",
    secondaryKeywords: ["executive KPI dashboard", "operational data analytics", "predictive business intelligence"],
    robots: "index, follow",
    rationale: "Attracting executive decision-makers needing real-time operational command centers over manual spreadsheets.",
  },

  // -------------------------------------------------------------
  // SERVICE: WEB PLATFORMS (/services/web-platforms)
  // -------------------------------------------------------------
  {
    route: "/services/web-platforms",
    locale: "fa",
    title: `طراحی و توسعه وب‌سایت و پلتفرم سازمانی | ${brandFa}`,
    description: `طراحی و توسعه وب‌سایت و پلتفرم سازمانی با سرعت بالا، پنل مدیریت محتوای اختصاصی و ساختار بهینه‌سازی‌شده برای سئو. درخواست مشاوره طراحی وب.`,
    ogTitle: `طراحی وب‌سایت و پلتفرم سازمانی | ${brandFa}`,
    ogDescription: `توسعه وب‌سایت‌های مدرن شرکتی و پورتال‌های سازمانی با تایپ‌اسکریپت و نکست‌جی‌اس.`,
    ogImageText: {
      line1: "طراحی وب‌سایت و پلتفرم سازمانی",
      line2: "سرعت لود بالا و سئوی فنی استاندارد",
    },
    primaryKeyword: "طراحی و توسعه وب‌سایت و پلتفرم سازمانی",
    secondaryKeywords: ["پورتال سازمانی اختصاصی", "طراحی وب‌سایت شرکتی مدرن", "سئوی فنی پلتفرم وب"],
    robots: "index, follow",
    rationale: "تمرکز بر پلتفرم‌های وب و پورتال‌های شرکتی با کیفیت فنی بالا و سرعت بهینه.",
  },
  {
    route: "/services/web-platforms",
    locale: "en",
    title: `Web Platform & Website Development | ${brandEn}`,
    description: `High-speed web platform and website development with tailored admin panels, robust security, and technical SEO. Schedule an engineering consultation.`,
    ogTitle: `Enterprise Web Platform Development | ${brandEn}`,
    ogDescription: `Modern web architecture engineered for speed, high conversion, and seamless multi-language content operations.`,
    ogImageText: {
      line1: "Enterprise Web Platform Development",
      line2: "Scalable Next.js Architecture",
    },
    primaryKeyword: "web platform and website development",
    secondaryKeywords: ["custom corporate web portals", "Next.js web engineering", "technical SEO platforms"],
    robots: "index, follow",
    rationale: "Targeting businesses looking for fast, scalable web platforms built with modern frontend frameworks.",
  },

  // -------------------------------------------------------------
  // SERVICE: CUSTOM SOFTWARE (/services/custom-software)
  // -------------------------------------------------------------
  {
    route: "/services/custom-software",
    locale: "fa",
    title: `توسعه نرم‌افزار سفارشی سازمانی | ${brandFa}`,
    description: `خدمات توسعه نرم‌افزار سفارشی سازمانی برای پیاده‌سازی منطق بیزینس اختصاصی و ایجاد سامانه‌های مقیاس‌پذیر و پایدار. شروع گفت‌وگوی فنی با تیم ما.`,
    ogTitle: `توسعه نرم‌افزار سفارشی سازمانی | ${brandFa}`,
    ogDescription: `برنامه‌نویسی و معماری سامانه‌های نرم‌افزاری متناسب با فرایندهای اختصاصی سازمان شما.`,
    ogImageText: {
      line1: "توسعه نرم‌افزار سفارشی سازمانی",
      line2: "معماری مقیاس‌پذیر و مهندسی پایدار",
    },
    primaryKeyword: "توسعه نرم‌افزار سفارشی سازمانی",
    secondaryKeywords: ["برنامه‌نویسی اختصاصی سازمان", "معماری نرم‌افزار مقیاس‌پذیر", "طراحی سیستم‌های سفارشی"],
    robots: "index, follow",
    rationale: "پاسخ به سازمان‌هایی که نرم‌افزارهای آماده نیازمندی‌های اختصاصی آنها را پوشش نمی‌دهد.",
  },
  {
    route: "/services/custom-software",
    locale: "en",
    title: `Custom Enterprise Software Development | ${brandEn}`,
    description: `Reliable custom enterprise software development tailored to complex operating workflows and legacy integrations. Request an initial consultation.`,
    ogTitle: `Custom Enterprise Software Development | ${brandEn}`,
    ogDescription: `Engineered software architectures built around unique operational rules, system stability, and clean codebases.`,
    ogImageText: {
      line1: "Custom Enterprise Software Development",
      line2: "Tailored Engineering for Business Logic",
    },
    primaryKeyword: "custom enterprise software development",
    secondaryKeywords: ["bespoke enterprise systems", "custom business software", "scalable system architecture"],
    robots: "index, follow",
    rationale: "Directly targeting CTOs looking to build proprietary software engines tailored to their unique business models.",
  },

  // -------------------------------------------------------------
  // PORTFOLIO LIST (/portfolio)
  // -------------------------------------------------------------
  {
    route: "/portfolio",
    locale: "fa",
    title: `مطالعات موردی و نمونه‌کارها | ${brandFa}`,
    description: `بررسی مطالعات موردی و نمونه‌کارها در کارا پرداز اوند شامل سامانه‌های عملیاتی، CRM، پلتفرم‌های وب و هوش مصنوعی. مشاهده جزئیات پروژه‌ها.`,
    ogTitle: `مطالعات موردی و پروژه‌های فنی | ${brandFa}`,
    ogDescription: `بررسی پروژه‌های واقعی کارا پرداز اوند با تمرکز بر مسئله کاری، معماری راه‌حل و خروجی عملیاتی.`,
    ogImageText: {
      line1: "مطالعات موردی و نمونه‌کارها",
      line2: "بررسی مسائل و راهکارهای نرم‌افزاری",
    },
    primaryKeyword: "مطالعات موردی و نمونه‌کارها",
    secondaryKeywords: ["پروژه‌های نرم‌افزاری سازمانی", "نمونه کارهای CRM و ERP", "پورتال‌های وب پیاده‌شده"],
    robots: "index, follow",
    rationale: "فهرست نمونه‌کارها و پروژه‌های عملیاتی اجراشده با هدف بررسی اعتبار و توان فنی شرکت.",
  },
  {
    route: "/portfolio",
    locale: "en",
    title: `Software Case Studies & Portfolio | ${brandEn}`,
    description: `Explore software case studies and portfolio projects across custom platforms, ERP, CRM, and AI by Kara Pardaz Avand. Review engineering deliverables.`,
    ogTitle: `Software Case Studies & Work | ${brandEn}`,
    ogDescription: `Verified case studies focusing on real business bottlenecks, engineering solutions, and operating outcomes.`,
    ogImageText: {
      line1: "Software Case Studies & Work",
      line2: "Delivered Systems & Real Outcomes",
    },
    primaryKeyword: "software case studies and portfolio",
    secondaryKeywords: ["enterprise software projects", "CRM case studies", "custom platform portfolio"],
    robots: "index, follow",
    rationale: "Portfolio index presenting verified delivered systems and problem-solving track record.",
  },

  // -------------------------------------------------------------
  // INSIGHTS LIST (/insights)
  // -------------------------------------------------------------
  {
    route: "/insights",
    locale: "fa",
    title: `مقالات تخصصی نرم‌افزار و هوش مصنوعی | ${brandFa}`,
    description: `مجموعه مقالات تخصصی نرم‌افزار و هوش مصنوعی درباره تحویل مرحله‌ای، امنیت RAG، معماری CRM و تجربیات مهندسی تیم کارا پرداز اوند. مطالعه یادداشت‌ها.`,
    ogTitle: `مقالات و تحلیل‌های تخصصی نرم‌افزار | ${brandFa}`,
    ogDescription: `یادداشت‌های کاربردی درباره مهندسی نرم‌افزار سازمانی، انتخاب CRM و پیاده‌سازی امن RAG.`,
    ogImageText: {
      line1: "مقالات تخصصی نرم‌افزار و هوش مصنوعی",
      line2: "تجربیات فنی و رویکردهای تحویل نرم‌افزار",
    },
    primaryKeyword: "مقالات تخصصی نرم‌افزار و هوش مصنوعی",
    secondaryKeywords: ["تحلیل معماری نرم‌افزار", "امنیت هوش مصنوعی RAG", "راهنمای انتخاب CRM"],
    robots: "index, follow",
    rationale: "بلاگ و مرکز مقالات فنی برای ارتقای رتبه ارگانیک و پاسخ به پرسش‌های معماری نرم‌افزار.",
  },
  {
    route: "/insights",
    locale: "en",
    title: `Enterprise Software & AI Insights | ${brandEn}`,
    description: `Read enterprise software and AI insights covering phased delivery, secure RAG boundaries, and CRM architecture by our engineers. Read the latest notes.`,
    ogTitle: `Enterprise Software & AI Insights | ${brandEn}`,
    ogDescription: `Engineering notes and actionable perspectives on phased software rollouts, internal RAG limits, and CRM selection.`,
    ogImageText: {
      line1: "Enterprise Software & AI Insights",
      line2: "Engineering Notes & Practical Guides",
    },
    primaryKeyword: "enterprise software and AI insights",
    secondaryKeywords: ["software engineering articles", "secure enterprise RAG", "CRM architecture guides"],
    robots: "index, follow",
    rationale: "Engineering blog hub providing educational value and thought leadership on modern systems.",
  },

  // -------------------------------------------------------------
  // PROCESS (/process)
  // -------------------------------------------------------------
  {
    route: "/process",
    locale: "fa",
    title: `مراحل همکاری و توسعه نرم‌افزار | ${brandFa}`,
    description: `آشنایی با مراحل همکاری و توسعه نرم‌افزار از تحلیل دامنه و طراحی معماری تا پیاده‌سازی چابک و پشتیبانی مستمر در کارا پرداز اوند. درخواست شروع همکاری.`,
    ogTitle: `مراحل همکاری و توسعه نرم‌افزار | ${brandFa}`,
    ogDescription: `فرآیند شفاف ۴ مرحله‌ای تحویل سیستم: تحلیل نیازمندی‌ها، طراحی فنی، توسعه گام‌به‌گام و پشتیبانی.`,
    ogImageText: {
      line1: "مراحل همکاری و توسعه نرم‌افزار",
      line2: "شفافیت در تحویل مرحله‌ای و پشتیبانی",
    },
    primaryKeyword: "مراحل همکاری و توسعه نرم‌افزار",
    secondaryKeywords: ["فرآیند توسعه چابک", "نحوه تحویل مرحله‌ای پروژه", "متدولوژی پیاده‌سازی نرم‌افزار"],
    robots: "index, follow",
    rationale: "شفاف‌سازی فرآیند همکاری و مراحل کاری برای کاهش ابهام کارفرمایان و مدیران پروژه.",
  },
  {
    route: "/process",
    locale: "en",
    title: `Software Development Process | ${brandEn}`,
    description: `Understand our software development process from domain discovery to production deployment and staged releases. Request an engineering consultation.`,
    ogTitle: `Software Development Process | ${brandEn}`,
    ogDescription: `Transparent engineering engagement model: discovery, architecture design, phased sprints, and continuous support.`,
    ogImageText: {
      line1: "Software Development Process",
      line2: "Lifecycle, Milestones & Collaboration",
    },
    primaryKeyword: "software development process",
    secondaryKeywords: ["engineering engagement process", "phased software delivery", "agile corporate development"],
    robots: "index, follow",
    rationale: "Outlining the engineering workflow to reassure potential clients about delivery rigor and communication.",
  },

  // -------------------------------------------------------------
  // ABOUT (/about)
  // -------------------------------------------------------------
  {
    route: "/about",
    locale: "fa",
    title: `درباره کارا پرداز اوند | مهندسی نرم‌افزار سازمانی`,
    description: `اطلاعات درباره کارا پرداز اوند، اصول همکاری مهندسی، تمرکز بر نرم‌افزارهای سازمانی و ارتباط ساختاری با برند والد Code1Sprint. آشنایی با مسیر ما.`,
    ogTitle: `درباره کارا پرداز اوند | مهندسی نرم‌افزار سازمانی`,
    ogDescription: `داستان کارا پرداز اوند، فرهنگ مهندسی و تعهد به ساخت نرم‌افزارهای دقیق سازمانی به عنوان برند همکار Code1Sprint.`,
    ogImageText: {
      line1: "درباره کارا پرداز اوند",
      line2: "اصول مهندسی، فرهنگ کاری و هویت برند",
    },
    primaryKeyword: "درباره کارا پرداز اوند",
    secondaryKeywords: ["شرکت توسعه نرم‌افزار سازمانی", "ارتباط با Code1Sprint", "فرهنگ فنی کارا پرداز اوند"],
    robots: "index, follow",
    rationale: "معرفی هویت حقوقی، تاریخچه، اصول کاری و ارتباط استراتژیک با شرکت والد.",
  },
  {
    route: "/about",
    locale: "en",
    title: `About Kara Pardaz Avand | Enterprise Engineering`,
    description: `Learn about Kara Pardaz Avand, our engineering principles, enterprise software focus, and corporate ties to Code1Sprint. Connect with our technical team.`,
    ogTitle: `About Kara Pardaz Avand | Enterprise Engineering`,
    ogDescription: `Engineering culture, delivery principles, and sister-brand foundation within the Code1Sprint ecosystem.`,
    ogImageText: {
      line1: "About Kara Pardaz Avand",
      line2: "Engineering Culture & Brand Foundation",
    },
    primaryKeyword: "about Kara Pardaz Avand",
    secondaryKeywords: ["enterprise engineering company", "Code1Sprint sister brand", "software company profile"],
    robots: "index, follow",
    rationale: "Establishing company authority, engineering background, and sister-brand lineage.",
  },

  // -------------------------------------------------------------
  // FAQ (/faq)
  // -------------------------------------------------------------
  {
    route: "/faq",
    locale: "fa",
    title: `سوالات متداول همکاری نرم‌افزاری | ${brandFa}`,
    description: `پاسخ به سوالات متداول همکاری نرم‌افزاری درباره مدل‌های توسعه، نحوه تحویل مرحله‌ای، استقرار سیستم و خدمات پشتیبانی کارا پرداز اوند. ارسال پرسش جدید.`,
    ogTitle: `سوالات متداول همکاری نرم‌افزاری | ${brandFa}`,
    ogDescription: `پاسخ‌های صریح به سوالات متداول مدیران درباره لایسنس، متدولوژی، زمان‌بندی و شرایط همکاری فنی.`,
    ogImageText: {
      line1: "سوالات متداول همکاری نرم‌افزاری",
      line2: "پاسخ‌های شفاف به پرسش‌های کارفرمایان",
    },
    primaryKeyword: "سوالات متداول همکاری نرم‌افزاری",
    secondaryKeywords: ["پرسش‌های متداول توسعه نرم‌افزار", "نحوه محاسبه زمان پروژه", "پشتیبانی نرم‌افزار سازمانی"],
    robots: "index, follow",
    rationale: "پاسخ سریع و مستند به متداول‌ترین دغدغه‌های کارفرمایان پیش از عقد قرارداد.",
  },
  {
    route: "/faq",
    locale: "en",
    title: `Software Engagement FAQ | ${brandEn}`,
    description: `Read our software engagement FAQ answering questions on development scoping, staged rollouts, integrations, and post-launch support. Contact our team.`,
    ogTitle: `Frequently Asked Questions | ${brandEn}`,
    ogDescription: `Clear answers to frequent client questions regarding delivery milestones, code handover, and tech stack choices.`,
    ogImageText: {
      line1: "Frequently Asked Questions",
      line2: "Engagement, Delivery & Operations",
    },
    primaryKeyword: "software engagement FAQ",
    secondaryKeywords: ["software project FAQ", "enterprise engineering questions", "client onboarding answers"],
    robots: "index, follow",
    rationale: "Addressing buyer inquiries about engagement models and project risk mitigation upfront.",
  },

  // -------------------------------------------------------------
  // CONTACT (/contact)
  // -------------------------------------------------------------
  {
    route: "/contact",
    locale: "fa",
    title: `درخواست مشاوره نرم‌افزار سازمانی | ${brandFa}`,
    description: `ارسال پیام و درخواست مشاوره نرم‌افزار سازمانی با کارشناسان فنی کارا پرداز اوند برای بررسی نیازهای CRM، ERP، وب و هوش مصنوعی. بررسی مسیر همکاری.`,
    ogTitle: `تماس و درخواست مشاوره تخصصی | ${brandFa}`,
    ogDescription: `فرم ارسال شرح نیازمندی‌ها، کانال‌های رسمی ارتباط و هماهنگی جلسه ارزیابی فنی اولیه.`,
    ogImageText: {
      line1: "تماس و درخواست مشاوره",
      line2: "ارزیابی فنی نیازمندی‌های سازمانی شما",
    },
    primaryKeyword: "درخواست مشاوره نرم‌افزار سازمانی",
    secondaryKeywords: ["تماس با کارا پرداز اوند", "ارزیابی اولیه پروژه نرم‌افزاری", "جلسه مشاوره CRM و ERP"],
    robots: "index, follow",
    rationale: "صفحه تبدیل اصلی سایت برای ارسال درخواست مشاوره و بررسی دامنه همکاری فنی.",
  },
  {
    route: "/contact",
    locale: "en",
    title: `Enterprise Software Consultation | ${brandEn}`,
    description: `Schedule an enterprise software consultation with Kara Pardaz Avand engineers for CRM, ERP, and AI systems. Connect with our technical team today.`,
    ogTitle: `Contact & Consultation | ${brandEn}`,
    ogDescription: `Direct contact channels and project inquiry form to discuss software requirements and technical architecture.`,
    ogImageText: {
      line1: "Contact & Consultation",
      line2: "Discuss Your Technical Architecture",
    },
    primaryKeyword: "enterprise software consultation",
    secondaryKeywords: ["contact Kara Pardaz Avand", "project inquiry form", "schedule technical consultation"],
    robots: "index, follow",
    rationale: "Conversion page enabling prospective clients to initiate technical discussions and evaluations.",
  },

  // -------------------------------------------------------------
  // PRIVACY (/privacy)
  // -------------------------------------------------------------
  {
    route: "/privacy",
    locale: "fa",
    title: `سیاست حفظ حریم خصوصی کاربران | ${brandFa}`,
    description: `شرح سیاست حفظ حریم خصوصی کاربران و اصول کارا پرداز اوند در حفاظت از داده‌های سازمانی و اطلاعات ارتباطی ثبت‌شده در وب‌سایت. مطالعه متن کامل ضوابط.`,
    ogTitle: `سیاست حفظ حریم خصوصی | ${brandFa}`,
    ogDescription: `تعهدات حقوقی در مدیریت داده‌ها، حفاظت از اطلاعات تماس فرم‌ها و حفظ محرمانگی سازمانی.`,
    ogImageText: {
      line1: "سیاست حفظ حریم خصوصی",
      line2: "حفاظت مسئولانه از داده‌ها و محرمانگی",
    },
    primaryKeyword: "سیاست حفظ حریم خصوصی کاربران",
    secondaryKeywords: ["حفاظت از داده‌های سازمانی", "محرمانگی اطلاعات در وب‌سایت", "ضوابط پردازش اطلاعات"],
    robots: "index, follow",
    rationale: "سند حقوقی حفظ حریم خصوصی و استانداردهای پردازش امن داده‌ها در سایت.",
  },
  {
    route: "/privacy",
    locale: "en",
    title: `Privacy Policy & Data Handling | ${brandEn}`,
    description: `Review our privacy policy and data handling principles regarding organizational information and inquiry submissions at Kara Pardaz Avand. Read terms.`,
    ogTitle: `Privacy Policy & Data Protection | ${brandEn}`,
    ogDescription: `Transparent privacy safeguards and responsible data practices for website visitors and inquiry forms.`,
    ogImageText: {
      line1: "Privacy Policy",
      line2: "Responsible Data Practices",
    },
    primaryKeyword: "privacy policy and data handling",
    secondaryKeywords: ["data protection standards", "corporate privacy policy", "inquiry confidentiality"],
    robots: "index, follow",
    rationale: "Factual legal disclosures ensuring user privacy protection and compliance.",
  },

  // -------------------------------------------------------------
  // TERMS (/terms)
  // -------------------------------------------------------------
  {
    route: "/terms",
    locale: "fa",
    title: `شرایط و ضوابط استفاده از وب‌سایت | ${brandFa}`,
    description: `متن شرایط و ضوابط استفاده از وب‌سایت کارا پرداز اوند، حقوق مالکیت فکری، حدود مسئولیت و رویه‌های قانونی آغاز همکاری‌های فنی. مطالعه ضوابط حقوقی.`,
    ogTitle: `شرایط و قوانین استفاده | ${brandFa}`,
    ogDescription: `ضوابط حاکم بر استفاده از خدمات، محتوای اختصاصی وب‌سایت و حدود مسئولیت‌های قانونی.`,
    ogImageText: {
      line1: "شرایط و ضوابط استفاده",
      line2: "مالکیت فکری و حدود مسئولیت قانونی",
    },
    primaryKeyword: "شرایط و ضوابط استفاده از وب‌سایت",
    secondaryKeywords: ["قوانین استفاده از وب‌سایت", "مالکیت فکری نرم‌افزار", "شرایط همکاری فنی"],
    robots: "index, follow",
    rationale: "ضوابط استفاده، مالکیت معنوی، حدود تعهدات و شفاف‌سازی مبانی همکاری فنی.",
  },
  {
    route: "/terms",
    locale: "en",
    title: `Terms of Use & Service Agreements | ${brandEn}`,
    description: `Read the terms of use and service agreements governing access, intellectual property, and technical engagements with Kara Pardaz Avand. View guidelines.`,
    ogTitle: `Terms of Use & Agreements | ${brandEn}`,
    ogDescription: `Legal terms regulating website access, intellectual property, and service engagement parameters.`,
    ogImageText: {
      line1: "Terms of Use",
      line2: "Intellectual Property & Engagement Rules",
    },
    primaryKeyword: "terms of use and service agreements",
    secondaryKeywords: ["website terms of service", "software intellectual property", "engagement terms"],
    robots: "index, follow",
    rationale: "Defining standard intellectual property, liability boundaries, and terms of service.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: AMLAK PALIZ (/portfolio/amlak-paliz)
  // -------------------------------------------------------------
  {
    route: "/portfolio/amlak-paliz",
    locale: "fa",
    title: `پالیز: مدیریت معاملات و CRM املاک | ${brandFa}`,
    description: `پیاده‌سازی سامانه مدیریت معاملات و CRM املاک در پالیز برای ساماندهی سرنخ‌های خریداران و هماهنگی بازدیدها در شعب ملکی. درخواست مشاوره تخصصی.`,
    ogTitle: `پالیز: سامانه معاملات و CRM املاک | ${brandFa}`,
    ogDescription: `یکپارچه‌سازی شعب متعدد معاملات ملکی و حذف تداخل کاری مشاوران با CRM اختصاصی.`,
    ogImageText: {
      line1: "پالیز: سامانه جامع معاملات و CRM املاک",
      line2: "یکپارچگی شعب و مدیریت سرنخ‌های خریدار",
    },
    primaryKeyword: "مدیریت معاملات و CRM املاک",
    secondaryKeywords: ["CRM مشاوران املاک", "مدیریت سرنخ‌های کارگزاری ملکی", "سامانه معاملات املاک"],
    robots: "index, follow",
    rationale: "مطالعه موردی سامانه پالیز در صنعت املاک و مستغلات با تمرکز بر ساماندهی پیگیری خریداران.",
  },
  {
    route: "/portfolio/amlak-paliz",
    locale: "en",
    title: `Paliz: Real Estate CRM Platform | ${brandEn}`,
    description: `Engineering the Paliz real estate CRM platform to unify scattered buyer leads, branch operations, and agent scheduling. Request a software consultation.`,
    ogTitle: `Paliz: Real Estate CRM Platform | ${brandEn}`,
    ogDescription: `Case study on resolving lost buyer inquiries and multi-branch scheduling with a custom real estate CRM.`,
    ogImageText: {
      line1: "Paliz: Real Estate CRM Platform",
      line2: "Multi-Branch Pipeline Management",
    },
    primaryKeyword: "Paliz real estate CRM platform",
    secondaryKeywords: ["realty brokerage CRM", "property buyer lead management", "custom brokerage software"],
    robots: "index, follow",
    rationale: "Case study illustrating how custom CRM architecture solved lead leakage for multi-branch brokerages.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: BETONIKA (/portfolio/betonika)
  // -------------------------------------------------------------
  {
    route: "/portfolio/betonika",
    locale: "fa",
    title: `بتونیکا: سامانه دیسپچ و صنعت بتن | ${brandFa}`,
    description: `طراحی سامانه دیسپچ و صنعت بتن در بتونیکا برای تخمین دقیق احجام مصالح و هماهنگی بلادرنگ ناوگان میکسرها در کارگاه‌های عمرانی. بررسی راهکارها.`,
    ogTitle: `بتونیکا: سامانه مهندسی دیسپچ بتن | ${brandFa}`,
    ogDescription: `ساماندهی سفارش‌گیری، کنترل اسلامپ و دیسپچ ناوگان میکسرها در کارخانجات بتن آماده.`,
    ogImageText: {
      line1: "بتونیکا: سامانه مهندسی دیسپچ بتن آماده",
      line2: "هماهنگی ناوگان میکسرها و تخمین احجام",
    },
    primaryKeyword: "سامانه دیسپچ و صنعت بتن",
    secondaryKeywords: ["نرم‌افزار دیسپچ بتن آماده", "مدیریت ناوگان میکسرها", "سامانه کارگاه‌های عمرانی"],
    robots: "index, follow",
    rationale: "مطالعه موردی بتونیکا برای مهندسی عمران، دیسپچ ناوگان و محاسبات فنی بتن آماده.",
  },
  {
    route: "/portfolio/betonika",
    locale: "en",
    title: `Betonika: Concrete Dispatch System | ${brandEn}`,
    description: `Development of the Betonika concrete dispatch system to coordinate ready-mix mixer fleets and volume calculations on job sites. Explore custom systems.`,
    ogTitle: `Betonika: Concrete Dispatch System | ${brandEn}`,
    ogDescription: `Engineering dispatch intelligence and slump calculation tools to eliminate delivery delays for ready-mix fleets.`,
    ogImageText: {
      line1: "Betonika: Ready-Mix Dispatch System",
      line2: "Fleet Coordination & Volume Estimation",
    },
    primaryKeyword: "Betonika concrete dispatch system",
    secondaryKeywords: ["ready-mix fleet logistics", "concrete volume estimation software", "civil engineering dispatch"],
    robots: "index, follow",
    rationale: "Case study explaining logistical software dispatch built for ready-mix concrete production and fleets.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: CLINICK (/portfolio/clinick)
  // -------------------------------------------------------------
  {
    route: "/portfolio/clinick",
    locale: "fa",
    title: `کلینیک: سامانه درمانگاه و پرونده سلامت | ${brandFa}`,
    description: `توسعه سامانه درمانگاه و پرونده سلامت در کلینیک برای جلوگیری از هم‌پوشانی نوبت‌ها و حفظ محرمانگی بالینی بیماران. درخواست مشاوره سلامت.`,
    ogTitle: `کلینیک: سامانه درمانگاه و پرونده سلامت | ${brandFa}`,
    ogDescription: `مدیریت یکپارچه نوبت‌دهی چندشعبه‌ای، پذیرش هوشمند و حفظ پرونده سلامت بیماران.`,
    ogImageText: {
      line1: "کلینیک: مدیریت درمانگاه و پرونده سلامت",
      line2: "جلوگیری از تداخل نوبت‌ها و پذیرش هوشمند",
    },
    primaryKeyword: "سامانه درمانگاه و پرونده سلامت",
    secondaryKeywords: ["نرم‌افزار پرونده سلامت الکترونیک", "سامانه نوبت‌دهی درمانگاه", "مدیریت کلینیک چندشعبه‌ای"],
    robots: "index, follow",
    rationale: "مطالعه موردی سامانه سلامت دیجیتال کلینیک با تاکید بر نوبت‌دهی و پرونده الکترونیک سلامت.",
  },
  {
    route: "/portfolio/clinick",
    locale: "en",
    title: `Clinick: Clinic Management System | ${brandEn}`,
    description: `Building the Clinick clinic management system with digital health records to prevent double-booking and streamline reception desks. Request a consultation.`,
    ogTitle: `Clinick: Clinic Management System | ${brandEn}`,
    ogDescription: `Multi-branch scheduling and electronic health record portal ensuring confidentiality and zero appointment overlaps.`,
    ogImageText: {
      line1: "Clinick: Clinic Management & EHR",
      line2: "Multi-Branch Reception & Patient Records",
    },
    primaryKeyword: "Clinick clinic management system",
    secondaryKeywords: ["electronic health records portal", "medical clinic appointment software", "digital healthcare systems"],
    robots: "index, follow",
    rationale: "Case study covering clinic workflow digitalization, eliminating double-booking and securing clinical data.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: GOLDENOO (/portfolio/goldenoo)
  // -------------------------------------------------------------
  {
    route: "/portfolio/goldenoo",
    locale: "fa",
    title: `گلدنو: پلتفرم گالری طلا و مظنه زنده | ${brandFa}`,
    description: `پیاده‌سازی پلتفرم گالری طلا و مظنه زنده در گلدنو با موتور محاسبه مظنه لحظه‌ای، کارمزد ساخت و فرمول‌های قانونی مالیات طلا. مشاهده دموی پلتفرم.`,
    ogTitle: `گلدنو: پلتفرم طلا و موتور مظنه زنده | ${brandFa}`,
    ogDescription: `فروش آنلاین جواهرات با محاسبه دقیق اجرت ساخت، فرمول مالیات و قیمت بلادرنگ مظنه.`,
    ogImageText: {
      line1: "گلدنو: پلتفرم آنلاین طلا و موتور مظنه",
      line2: "محاسبه لحظه‌ای قیمت طلا و کارمزد ساخت",
    },
    primaryKeyword: "پلتفرم گالری طلا و مظنه زنده",
    secondaryKeywords: ["موتور محاسبه مظنه طلا", "پلتفرم فروشگاهی طلا و جواهر", "سیستم محاسبه مالیات طلا"],
    robots: "index, follow",
    rationale: "مطالعه موردی گلدنو در حوزه تجارت آنلاین طلا با موتور بلادرنگ محاسبه قیمت و مالیات.",
  },
  {
    route: "/portfolio/goldenoo",
    locale: "en",
    title: `Goldenoo: Online Gold Gallery Engine | ${brandEn}`,
    description: `Engineering the Goldenoo online gold gallery engine with real-time bullion pricing updates and transparent fee calculators. Discover our eCommerce work.`,
    ogTitle: `Goldenoo: Online Gold Gallery Engine | ${brandEn}`,
    ogDescription: `High-precision jewelry commerce platform supporting dynamic gold spot pricing and complex fabrication tariffs.`,
    ogImageText: {
      line1: "Goldenoo: Gold Gallery Commerce Engine",
      line2: "Live Bullion Pricing & Tariffs",
    },
    primaryKeyword: "Goldenoo online gold gallery engine",
    secondaryKeywords: ["real-time gold pricing platform", "luxury jewelry eCommerce", "automated bullion calculation"],
    robots: "index, follow",
    rationale: "Case study explaining how live pricing APIs and dynamic taxation calculators powered an online gold gallery.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: IRONSTEC (/portfolio/ironstec)
  // -------------------------------------------------------------
  {
    route: "/portfolio/ironstec",
    locale: "fa",
    title: `ایران‌ستک: مدیریت ساخت سازه‌های فولادی | ${brandFa}`,
    description: `توسعه سامانه مدیریت ساخت سازه‌های فولادی در ایران‌ستک برای مستندسازی مراحل بازرسی جوش و ارائه ابعاد فنی توانمندی‌های کارگاهی. بررسی جزییات فنی.`,
    ogTitle: `ایران‌ستک: مدیریت سازه‌های سنگین فولادی | ${brandFa}`,
    ogDescription: `پلتفرم شفاف‌سازی فرآیندهای بازرسی جوش و توانمندی‌های کارگاهی ساخت سازه‌های عظیم فلزی.`,
    ogImageText: {
      line1: "ایران‌ستک: پلتفرم مهندسی سازه‌های فولادی",
      line2: "مستندسازی بازرسی جوش و توان کارگاهی",
    },
    primaryKeyword: "مدیریت ساخت سازه‌های فولادی",
    secondaryKeywords: ["پلتفرم ساخت سوله‌های صنعتی", "مستندسازی بازرسی جوش", "پورتال صنایع سنگین فولادی"],
    robots: "index, follow",
    rationale: "مطالعه موردی ایران‌ستک در حوزه مهندسی سازه‌های صنعتی و بازرسی استانداردهای جوشکاری.",
  },
  {
    route: "/portfolio/ironstec",
    locale: "en",
    title: `Ironstec: Heavy Steel Engineering | ${brandEn}`,
    description: `Ironstec case study: custom heavy steel engineering platform for welding inspection documentation and fabrication capacity. Request an architecture review.`,
    ogTitle: `Ironstec: Heavy Steel Engineering | ${brandEn}`,
    ogDescription: `Industrial portal demonstrating welding inspection records, plant capacity metrics, and fabrication compliance.`,
    ogImageText: {
      line1: "Ironstec: Heavy Steel Engineering",
      line2: "Industrial Fabrication & Quality Audits",
    },
    primaryKeyword: "heavy steel engineering",
    secondaryKeywords: ["steel structure engineering portal", "welding audit documentation", "heavy industry web platform"],
    robots: "index, follow",
    rationale: "Industrial case study focusing on technical capacity presentation and fabrication audit transparency.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: LUXORIA (/portfolio/luxoria)
  // -------------------------------------------------------------
  {
    route: "/portfolio/luxoria",
    locale: "fa",
    title: `لوکسوریا: پورتال رزرواسیون هتل و کنسیرژ | ${brandFa}`,
    description: `طراحی پورتال رزرواسیون هتل لوکسوریا و خدمات کنسیرژ برای تسهیل انتخاب موقعیت اقامتی و تشریفات اختصاصی مهمانان لوکس. شروع گفت‌وگو درباره پورتال.`,
    ogTitle: `لوکسوریا: رزرواسیون هتل و کنسیرژ VIP | ${brandFa}`,
    ogDescription: `پورتال تشریفات و اقامت لوکس با امکان انتخاب اختصاصی موقعیت میزها و خدمات شخصی‌سازی‌شده.`,
    ogImageText: {
      line1: "لوکسوریا: پورتال رزرواسیون هتل و کنسیرژ",
      line2: "خدمات تشریفات VIP و اقامت شخصی‌سازی‌شده",
    },
    primaryKeyword: "پورتال رزرواسیون هتل لوکسوریا",
    secondaryKeywords: ["رزرواسیون خدمات کنسیرژ VIP", "پورتال هتل‌های لوکس", "سامانه تشریفات مهمان‌نوازی"],
    robots: "index, follow",
    rationale: "مطالعه موردی لوکسوریا در زمینه گردشگری، هتل‌های ۵ ستاره و رزرو تشریفات اختصاصی VIP.",
  },
  {
    route: "/portfolio/luxoria",
    locale: "en",
    title: `Luxoria: VIP Hotel Concierge Portal | ${brandEn}`,
    description: `Designing the Luxoria VIP hotel concierge portal with curated table bookings and personalized stay arrangements for guests. Schedule an intro consultation.`,
    ogTitle: `Luxoria: VIP Hotel Concierge Portal | ${brandEn}`,
    ogDescription: `Bespoke hospitality reservation portal with tailored concierge bookings and intuitive spatial dining selection.`,
    ogImageText: {
      line1: "Luxoria: VIP Concierge & Booking Portal",
      line2: "Luxury Hospitality & Dining Reservations",
    },
    primaryKeyword: "Luxoria VIP hotel concierge portal",
    secondaryKeywords: ["luxury hospitality portal", "VIP concierge booking system", "hotel reservation software"],
    robots: "index, follow",
    rationale: "Hospitality case study detailing personalized guest workflows and intuitive booking flows.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: NOIR (/portfolio/noir)
  // -------------------------------------------------------------
  {
    route: "/portfolio/noir",
    locale: "fa",
    title: `نوآر: پلتفرم مد ادیتوریال و شوروم اختصاصی | ${brandFa}`,
    description: `پیاده‌سازی پلتفرم مد ادیتوریال نوآر برای نمایشگاه دیجیتال لباس‌های اوت‌کوتور با هویت بصری مدرن و ناوبری روان کاربران. مشاوره طراحی پلتفرم اختصاصی.`,
    ogTitle: `نوآر: پلتفرم دیجیتال مد ادیتوریال | ${brandFa}`,
    ogDescription: `شوروم دیجیتال خانه‌های مد اوت‌کوتور با ساختار لوک‌بوک تعاملی و تجربه کاربری متمایز.`,
    ogImageText: {
      line1: "نوآر: پلتفرم مد ادیتوریال و شوروم",
      line2: "شوروم دیجیتال پوشاک اوت‌کوتور معاصر",
    },
    primaryKeyword: "پلتفرم مد ادیتوریال نوآر",
    secondaryKeywords: ["شوروم دیجیتال لباس اختصاصی", "پلتفرم برندهای مد لوکس", "طراحی وب ادیتوریال فشن"],
    robots: "index, follow",
    rationale: "مطالعه موردی نوآر در حوزه پوشاک سفارشی و شوروم‌های دیجیتال ادیتوریال فشن.",
  },
  {
    route: "/portfolio/noir",
    locale: "en",
    title: `Noir: Editorial Fashion Showroom | ${brandEn}`,
    description: `Developing the Noir editorial fashion showroom platform for couture garments with fluid layout transitions and lookbook flows. Request a digital consult.`,
    ogTitle: `Noir: Editorial Fashion Showroom | ${brandEn}`,
    ogDescription: `Digital haute couture showroom showcasing bespoke garments through immersive typography and fluid imagery.`,
    ogImageText: {
      line1: "Noir: Editorial Fashion Showroom",
      line2: "Interactive Lookbooks & Haute Couture",
    },
    primaryKeyword: "Noir editorial fashion showroom",
    secondaryKeywords: ["digital fashion showroom", "haute couture web platform", "editorial lookbook design"],
    robots: "index, follow",
    rationale: "Creative case study showing high-craft digital editorial design for boutique fashion houses.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: OPS-CRM-PILOT (/portfolio/ops-crm-pilot)
  // -------------------------------------------------------------
  {
    route: "/portfolio/ops-crm-pilot",
    locale: "fa",
    title: `پایلوت CRM عملیات فروش B2B | ${brandFa}`,
    description: `مطالعه پایلوت CRM عملیات فروش B2B برای یکپارچه‌سازی کانال‌های پیگیری فرصت‌ها و شفاف‌سازی مراحل قیف برای مدیران تیم. بررسی فرآیند پیاده‌سازی.`,
    ogTitle: `پایلوت CRM عملیات فروش B2B | ${brandFa}`,
    ogDescription: `یکپارچه‌سازی پایپ‌لاین فرصت‌های فروش، ردیابی پیگیری‌ها و حذف نشت سرنخ‌ها در عملیات B2B.`,
    ogImageText: {
      line1: "پایلوت CRM عملیات فروش B2B",
      line2: "یکپارچگی کانال‌های پیگیری و شفافیت قیف",
    },
    primaryKeyword: "پایلوت CRM عملیات فروش B2B",
    secondaryKeywords: ["طراحی پایلوت CRM", "مدیریت قیف فروش B2B", "اتوماسیون ردیابی فرصت‌ها"],
    robots: "index, follow",
    rationale: "پایلوت اجرایی CRM برای تست و یکپارچه‌سازی فرآیندهای پیگیری فروش در سازمان‌های B2B.",
  },
  {
    route: "/portfolio/ops-crm-pilot",
    locale: "en",
    title: `B2B Sales CRM Pilot Case | ${brandEn}`,
    description: `Evaluating a B2B sales CRM pilot deployment to consolidate dispersed opportunity pipelines into one clear view for teams. Request an architecture review.`,
    ogTitle: `B2B Sales CRM Pilot Deployment | ${brandEn}`,
    ogDescription: `Staged implementation unifying dispersed opportunity channels and tracking stages for B2B sales managers.`,
    ogImageText: {
      line1: "B2B Sales CRM Pilot Deployment",
      line2: "Consolidated Pipeline & Lead Visibility",
    },
    primaryKeyword: "B2B sales CRM pilot",
    secondaryKeywords: ["sales operations pilot CRM", "B2B opportunity pipeline", "staged CRM implementation"],
    robots: "index, follow",
    rationale: "Case study evaluating the risk reduction achieved through staged CRM pilot rollouts.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: PARAK-STORE (/portfolio/parak-store)
  // -------------------------------------------------------------
  {
    route: "/portfolio/parak-store",
    locale: "fa",
    title: `پاراک استور: تجارت الکترونیک پوشاک | ${brandFa}`,
    description: `توسعه سیستم تجارت الکترونیک پوشاک در پاراک استور برای مدیریت سریع کاتالوگ‌های چندواریانتی مد و پاسخگویی به جهش‌های ترافیکی. دریافت مشاوره طراحی.`,
    ogTitle: `پاراک استور: پلتفرم هدلس پوشاک | ${brandFa}`,
    ogDescription: `فروشگاه اینترنتی مد با معماری هدلس، بارگذاری فوق سریع و تفکیک موجودی چند شعبه‌ای.`,
    ogImageText: {
      line1: "پاراک استور: تجارت الکترونیک هدلس مد",
      line2: "مدیریت کاتالوگ و سرعت پردازش سفارش",
    },
    primaryKeyword: "تجارت الکترونیک پوشاک",
    secondaryKeywords: ["فروشگاه آنلاین پوشاک هدلس", "معماری هدلس کامرس", "کاتالوگ چندواریانتی مد"],
    robots: "index, follow",
    rationale: "مطالعه موردی معماری هدلس فروشگاهی در مواجهه با کاتالوگ‌های پیچیده و ترافیک بالا.",
  },
  {
    route: "/portfolio/parak-store",
    locale: "en",
    title: `Parak Store: Headless Commerce | ${brandEn}`,
    description: `Engineering Parak Store headless commerce architecture to handle multi-attribute fashion catalogs under heavy buyer traffic. Request a commerce evaluation.`,
    ogTitle: `Parak Store: Headless Fashion Commerce | ${brandEn}`,
    ogDescription: `Headless eCommerce architecture built for multi-variant apparel inventories, multi-branch stocks, and sub-second page loads.`,
    ogImageText: {
      line1: "Parak Store: Headless Fashion Commerce",
      line2: "Multi-Variant Inventory & Speed",
    },
    primaryKeyword: "Parak Store headless commerce",
    secondaryKeywords: ["headless fashion eCommerce", "multi-variant inventory architecture", "high-performance web store"],
    robots: "index, follow",
    rationale: "Showcasing headless commerce capabilities for high-volume fashion retailers with complex SKU structures.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: RAG-KNOWLEDGE-PILOT (/portfolio/rag-knowledge-pilot)
  // -------------------------------------------------------------
  {
    route: "/portfolio/rag-knowledge-pilot",
    locale: "fa",
    title: `پایلوت RAG دانش داخلی سازمان | ${brandFa}`,
    description: `طراحی پایلوت RAG دانش داخلی سازمان برای جایگزینی جست‌وجوی دستی در اسناد با هوش مصنوعی متصل به مراجع معتبر سازمانی. بررسی امکان‌سنجی پروژه‌ها.`,
    ogTitle: `پایلوت RAG دانش داخلی سازمان | ${brandFa}`,
    ogDescription: `چت‌بات هوشمند متصل به اسناد سازمانی با استناد به مراجع و حفظ سطوح دسترسی کاربران.`,
    ogImageText: {
      line1: "پایلوت RAG دانش داخلی سازمان",
      line2: "جست‌وجوی هوشمند با استناد به اسناد داخلی",
    },
    primaryKeyword: "پایلوت RAG دانش داخلی سازمان",
    secondaryKeywords: ["هوش مصنوعی اسناد شرکتی", "جستجوی معنایی دانش سازمانی", "پایلوت سیستم RAG"],
    robots: "index, follow",
    rationale: "پایلوت پیاده‌سازی چت‌بات متصل به اسناد داخلی جهت سنجش دقت و امنیت دسترسی.",
  },
  {
    route: "/portfolio/rag-knowledge-pilot",
    locale: "en",
    title: `Internal Knowledge RAG Pilot | ${brandEn}`,
    description: `Prototyping an internal knowledge RAG pilot to replace tedious manual document searches with verifiable cited answers. Contact us for AI feasibility.`,
    ogTitle: `Internal Knowledge RAG Pilot | ${brandEn}`,
    ogDescription: `Grounded RAG pilot evaluating document retrieval precision, verified citations, and departmental access separation.`,
    ogImageText: {
      line1: "Internal Knowledge RAG Pilot",
      line2: "Replacing Manual Search with Verified AI",
    },
    primaryKeyword: "internal knowledge RAG pilot",
    secondaryKeywords: ["enterprise RAG prototyping", "document knowledge assistant", "verifiable source citations"],
    robots: "index, follow",
    rationale: "Proving viability of internal document question-answering with strictly verifiable source citations.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: RAG-PARAK (/portfolio/rag-parak)
  // -------------------------------------------------------------
  {
    route: "/portfolio/rag-parak",
    locale: "fa",
    title: `پاراک: موتور RAG سازمانی و دستیار صوتی | ${brandFa}`,
    description: `پیاده‌سازی موتور سازمانی RAG پاراک برای استخراج پاسخ‌های تاییدشده از اسناد فنی گسترده و کاتالوگ‌های پیچیده تجاری. درخواست دموی سیستم‌های هوش مصنوعی.`,
    ogTitle: `پاراک: موتور سازمانی RAG و جستجوی معنایی | ${brandFa}`,
    ogDescription: `موتور هوش مصنوعی RAG چندوجهی با قابلیت پردازش متن و صوت، استناد به منابع و کنترل سطح دسترسی.`,
    ogImageText: {
      line1: "پاراک: موتور RAG سازمانی و دستیار هوشمند",
      line2: "استخراج دقیق پاسخ‌ها از انبوه اسناد فنی",
    },
    primaryKeyword: "موتور سازمانی RAG پاراک",
    secondaryKeywords: ["هوش مصنوعی چندوجهی سازمانی", "استخراج اطلاعات از کاتالوگ‌های فنی", "دستیار صوتی و متنی سازمانی"],
    robots: "index, follow",
    rationale: "مطالعه موردی پاراک برای استقرار موتور RAG در مقیاس سازمانی با قابلیت صوت و استناددهی.",
  },
  {
    route: "/portfolio/rag-parak",
    locale: "en",
    title: `Parak: Multimodal Enterprise RAG | ${brandEn}`,
    description: `Implementing multimodal enterprise RAG to retrieve factual source-backed answers across large technical libraries. Request an enterprise AI demo.`,
    ogTitle: `Parak: Multimodal Enterprise RAG | ${brandEn}`,
    ogDescription: `Multimodal enterprise RAG system featuring voice inputs, citation tracking, and secure knowledge indexing.`,
    ogImageText: {
      line1: "Parak: Multimodal Enterprise RAG",
      line2: "Accurate Retrieval Over Dense Archives",
    },
    primaryKeyword: "multimodal enterprise RAG",
    secondaryKeywords: ["multimodal enterprise RAG", "technical document retrieval", "corporate AI voice assistant"],
    robots: "index, follow",
    rationale: "Production RAG case study handling technical archives, voice interactions, and strict citation traceability.",
  },

  // -------------------------------------------------------------
  // CASE STUDY: ZARA-ELITE (/portfolio/zara-elite)
  // -------------------------------------------------------------
  {
    route: "/portfolio/zara-elite",
    locale: "fa",
    title: `زارا الیت: ژورنال تعاملی استایل مد | ${brandFa}`,
    description: `طراحی پلتفرم زارا الیت با ژورنال تعاملی استایل مد برای درک بهتر فرم و جزئیات بافت لباس‌ها هنگام خرید اینترنتی. مشاهده سایر نمونه‌کارها.`,
    ogTitle: `زارا الیت: ژورنال تعاملی استایل | ${brandFa}`,
    ogDescription: `تجربه خرید آنلاین لباس با نمایش زوایای تن‌خور، بافت پارچه و ست‌های پیشنهادی هوشمند.`,
    ogImageText: {
      line1: "زارا الیت: پلتفرم فروشگاهی و ژورنال استایل",
      line2: "نمایش تعاملی تن‌خور لباس و جزئیات بافت",
    },
    primaryKeyword: "ژورنال تعاملی استایل مد",
    secondaryKeywords: ["ژورنال تعاملی استایل لباس", "فروشگاه آنلاین پوشاک لوکس", "نمایش جزئیات پارچه و تن‌خور"],
    robots: "index, follow",
    rationale: "مطالعه موردی زارا الیت در زمینه تجارت الکترونیک مد و نمایش تعاملی جزئیات پوشاک.",
  },
  {
    route: "/portfolio/zara-elite",
    locale: "en",
    title: `Zara Elite: Interactive Style Journal | ${brandEn}`,
    description: `Crafting the Zara Elite interactive style journal with dynamic garment previews to assist luxury shoppers with fit decisions. View our eCommerce projects.`,
    ogTitle: `Zara Elite: Interactive Style Journal | ${brandEn}`,
    ogDescription: `Fashion eCommerce portal integrating dynamic styling lookbooks and high-definition fabric visualization.`,
    ogImageText: {
      line1: "Zara Elite: Interactive Style Journal",
      line2: "Luxury Fashion Apparel & Fabric Details",
    },
    primaryKeyword: "interactive style journal",
    secondaryKeywords: ["interactive style lookbook", "luxury apparel eCommerce", "high-end garment visualization"],
    robots: "index, follow",
    rationale: "Focusing on digital customer experience innovations for luxury fashion through lookbooks and fit previews.",
  },

  // -------------------------------------------------------------
  // POST: CRM-FIT (/insights/crm-fit)
  // -------------------------------------------------------------
  {
    route: "/insights/crm-fit",
    locale: "fa",
    title: `معیار انتخاب CRM سفارشی یا آماده | ${brandFa}`,
    description: `بررسی معیار انتخاب CRM سفارشی یا آماده با تکیه بر فرایند فروش واقعی، پیچیدگی یکپارچه‌سازی و هزینه‌های مالکیت سیستم. مطالعه تحلیل کامل کارشناسی.`,
    ogTitle: `CRM سفارشی یا آماده؛ معیار انتخاب چیست؟ | ${brandFa}`,
    ogDescription: `چرا فهرست ویژگی‌های محصولات آماده ملاک غلطی است و چطور باید بر اساس فرآیند واقعی فروش تصمیم گرفت.`,
    ogImageText: {
      line1: "CRM سفارشی یا آماده؛ معیار انتخاب چیست؟",
      line2: "شروع از فرایند فروش واقعی، نه ویژگی‌ها",
    },
    primaryKeyword: "معیار انتخاب CRM سفارشی یا آماده",
    secondaryKeywords: ["مقایسه CRM اختصاصی و پکیج آماده", "هزینه مالکیت CRM سازمانی", "یکپارچه‌سازی فرآیند فروش"],
    robots: "index, follow",
    rationale: "مقاله تحلیلی برای مدیران فروش درباره تفاوت‌های تصمیم‌گیری بین خرید نرم‌افزار آماده و توسعه سفارشی.",
  },
  {
    route: "/insights/crm-fit",
    locale: "en",
    title: `Custom vs Off-the-Shelf CRM Selection | ${brandEn}`,
    description: `Evaluate custom vs off-the-shelf CRM selection criteria based on real sales workflows, integration depth, and license costs. Read our technical guide.`,
    ogTitle: `Custom vs Off-the-Shelf CRM: Decision Guide | ${brandEn}`,
    ogDescription: `Why feature matrix comparisons fail and how focusing on operational workflows dictates the right CRM choice.`,
    ogImageText: {
      line1: "Custom vs Off-the-Shelf CRM Criteria",
      line2: "Sales Workflow Alignment, Not Features",
    },
    primaryKeyword: "custom vs off-the-shelf CRM selection",
    secondaryKeywords: ["bespoke CRM evaluation", "sales pipeline integration costs", "CRM total cost of ownership"],
    robots: "index, follow",
    rationale: "Technical essay guiding operations managers on evaluating bespoke versus packaged CRM architectures.",
  },

  // -------------------------------------------------------------
  // POST: RAG-BOUNDARIES (/insights/rag-boundaries)
  // -------------------------------------------------------------
  {
    route: "/insights/rag-boundaries",
    locale: "fa",
    title: `مرزهای امن در سامانه‌های RAG سازمانی | ${brandFa}`,
    description: `اصول مرزهای امن در سامانه‌های RAG سازمانی؛ کنترل دسترسی به اسناد، جلوگیری از نشت اطلاعات محرمانه و اعتبارسنجی پاسخ‌ها. مطالعه راهنمای پیاده‌سازی.`,
    ogTitle: `مرزهای امن در سامانه‌های RAG سازمانی | ${brandFa}`,
    ogDescription: `نحوه اتصال ایمن مدل‌های زبانی به اسناد با تضمین استناددهی دقیق و رعایت سطوح دسترسی پرسنل.`,
    ogImageText: {
      line1: "مرزهای امن در سامانه‌های RAG سازمانی",
      line2: "کنترل دسترسی، استناددهی و حریم داده",
    },
    primaryKeyword: "مرزهای امن در سامانه‌های RAG سازمانی",
    secondaryKeywords: ["امنیت هوش مصنوعی سازمانی", "کنترل دسترسی در مدل‌های زبانی", "استناددهی در سیستم‌های RAG"],
    robots: "index, follow",
    rationale: "بررسی الزامات حیاتی امنیت و کنترل سطوح دسترسی هنگام اتصال هوش مصنوعی به اسناد محرمانه شرکت.",
  },
  {
    route: "/insights/rag-boundaries",
    locale: "en",
    title: `Enterprise RAG Security Boundaries | ${brandEn}`,
    description: `Practical enterprise RAG security boundaries: role-based access, document citation hygiene, and data containment. Read our deployment guide.`,
    ogTitle: `Enterprise RAG Security Boundaries | ${brandEn}`,
    ogDescription: `Connecting LLMs to corporate repositories safely with permission filters, zero data leakage, and exact citations.`,
    ogImageText: {
      line1: "Security Boundaries in Enterprise RAG",
      line2: "Access Control, Isolation & Citations",
    },
    primaryKeyword: "enterprise RAG security boundaries",
    secondaryKeywords: ["corporate LLM security", "permissioned RAG architecture", "confidential document AI"],
    robots: "index, follow",
    rationale: "Authoritative architectural post detailing access security and verifiable citations in enterprise RAG setups.",
  },

  // -------------------------------------------------------------
  // POST: STAGED-DELIVERY (/insights/staged-delivery)
  // -------------------------------------------------------------
  {
    route: "/insights/staged-delivery",
    locale: "fa",
    title: `تحویل مرحله‌ای در پروژه‌های نرم‌افزاری | ${brandFa}`,
    description: `مزایای تحویل مرحله‌ای در پروژه‌های نرم‌افزاری بزرگ؛ کنترل ریسک‌های مالی، دریافت بازخورد زودهنگام و تضمین پیشرفت شفاف سیستم. مطالعه رویکرد مهندسی.`,
    ogTitle: `تحویل مرحله‌ای نرم‌افزار؛ چرا دامنه را تکه می‌کنیم؟ | ${brandFa}`,
    ogDescription: `کاهش ریسک پروژه‌های سازمانی بزرگ با تقسیم کار به فازهای تحویل مشخص و ملموس.`,
    ogImageText: {
      line1: "تحویل مرحله‌ای؛ چرا دامنه را تکه می‌کنیم؟",
      line2: "کاهش ریسک پروژه و ورود بازخورد زودهنگام",
    },
    primaryKeyword: "تحویل مرحله‌ای در پروژه‌های نرم‌افزاری",
    secondaryKeywords: ["کاهش ریسک پروژه نرم‌افزاری", "تحویل فاز به فاز سامانه", "متدولوژی مهندسی نرم‌افزار"],
    robots: "index, follow",
    rationale: "توضیح دلایل مهندسی و تجاری تقسیم پروژه‌های بزرگ به فازهای کوچک و قابل تحویل پیوسته.",
  },
  {
    route: "/insights/staged-delivery",
    locale: "en",
    title: `Staged Delivery in Software Engineering | ${brandEn}`,
    description: `Why staged delivery in software engineering mitigates risk, accelerates real stakeholder feedback, and prevents scope creep. Read the full perspective.`,
    ogTitle: `Staged Delivery in Software Engineering | ${brandEn}`,
    ogDescription: `Mitigating development risks by delivering functional increments rather than waiting for massive monolithic releases.`,
    ogImageText: {
      line1: "Staged Delivery in Software Engineering",
      line2: "Mitigating Risk & Fast Stakeholder Input",
    },
    primaryKeyword: "staged delivery in software engineering",
    secondaryKeywords: ["incremental software rollout", "mitigating software risk", "agile scope management"],
    robots: "index, follow",
    rationale: "Outlining why incremental, milestone-based software delivery protects capital and ensures strategic alignment.",
  },
];

// Validate all collection items at module evaluation time
export const validatedRouteSeoMeta = routeSeoMetaCollection.map((item) =>
  RouteSeoMetaItemSchema.parse(item),
);

/**
 * Fast lookup helper for a route and locale.
 */
export function getRouteSeoMeta(route: string, locale: string): RouteSeoMetaItem | undefined {
  const normalizedRoute = !route || route === "/" ? "/" : route.startsWith("/") ? route : `/${route}`;
  const cleanRoute = normalizedRoute.replace(/\/+$/, "") || "/";
  return validatedRouteSeoMeta.find(
    (item) => item.route === cleanRoute && item.locale === locale,
  );
}
