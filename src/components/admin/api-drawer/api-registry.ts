export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiEndpointDef {
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  queryParams?: Array<{ name: string; type: string; desc: string; sample?: string }>;
  sampleBody?: Record<string, unknown>;
}

export interface ResourceApiConfig {
  id: string;
  title: string;
  titleEn: string;
  type: "collection" | "global" | "utility";
  basePath: string;
  endpoints: ApiEndpointDef[];
}

export const API_REGISTRY: Record<string, ResourceApiConfig> = {
  services: {
    id: "services",
    title: "مدیریت خدمات و راهکارها",
    titleEn: "Services Collection",
    type: "collection",
    basePath: "/api/admin/services",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/services",
        title: "فهرست تمامی خدمات",
        description: "دریافت فهرست خدمات با فیلتر وضعیت انتشار و جستجوی متنی",
        queryParams: [
          { name: "status", type: "string", desc: "فیلتر بر اساس published یا draft", sample: "published" },
          { name: "q", type: "string", desc: "جستجو در عنوان فارسی، انگلیسی یا اسلاگ", sample: "crm" },
        ],
      },
      {
        method: "POST",
        path: "/api/admin/services",
        title: "ایجاد خدمت جدید",
        description: "ثبت خدمت جدید با اعتبارسنجی کامل فیلدها و ساختار بنتو",
        sampleBody: {
          slug: "ai-enterprise",
          title: { fa: "هوش مصنوعی سازمانی", en: "Enterprise AI" },
          outcome: { fa: "اتوماسیون فرایندهای تصمیم‌گیری با هوش مصنوعی", en: "Automating decision flows with enterprise AI" },
          status: "published",
          bento: {
            order: 1,
            span: 4,
            image: "/media/bento/ai.png",
            shortTitle: { fa: "هوش مصنوعی", en: "Enterprise AI" },
          },
          audience: [{ fa: "مدیران فناوری و تحول دیجیتال", en: "CTOs and Digital Transformation Leaders" }],
          deliverables: [{ title: { fa: "مدل سفارشی سازمانی", en: "Custom Enterprise Model" }, description: { fa: "توسعه روی داده‌های داخلی", en: "Trained on internal data" } }],
          steps: [{ title: { fa: "نیازسنجی و امکان‌سنجی داده", en: "Data Feasibility" }, description: { fa: "بررسی کیفیت پایگاه داده", en: "Assessing data quality" } }],
          stack: [{ label: { fa: "فناوری‌ها", en: "Technologies" }, items: ["Python", "PyTorch", "vLLM", "Qdrant"] }],
          systemMap: {
            windowTitle: "ai-orchestrator.service",
            layout: "pipeline",
            descriptionLead: { fa: "معماری توزیع‌شده پایپ‌لاین هوش مصنوعی", en: "Distributed AI pipeline architecture" },
            description: { fa: "پردازش لحظه‌ای درخواست‌ها با موتور استنتاج بهینه", en: "Real-time inference engine" },
            nodes: {
              inputTop: { fa: "پایگاه دانش اسناد", en: "Knowledge Base" },
              inputBottom: { fa: "پایگاه داده رابطه‌ای", en: "Relational DB" },
              core: { fa: "موتور رگ و استنتاج", en: "RAG & Inference Core" },
              outputTop: { fa: "رابط گفتگوی هوشمند", en: "AI Chat Interface" },
              outputBottom: { fa: "سرویس وب‌هوک و API", en: "Webhooks & API" },
            },
            logs: [
              { fa: "مدل زبانی بارگذاری شد (1.2s)", en: "LLM model loaded (1.2s)" },
              { fa: "ایندکس برداری هماهنگ شد", en: "Vector index synced" },
              { fa: "پایپ‌لاین آماده پاسخگویی است", en: "Pipeline ready" },
            ],
          },
        },
      },
      {
        method: "GET",
        path: "/api/admin/services/:id",
        title: "دریافت جزئیات خدمت",
        description: "دریافت یک خدمت بر اساس شناسه دیتابیس (ObjectId) یا اسلاگ (slug)",
      },
      {
        method: "PATCH",
        path: "/api/admin/services/:id",
        title: "ویرایش و به‌روزرسانی خدمت (PATCH/PUT)",
        description: "به‌روزرسانی فیلدهای خدمت با شناسه یا اسلاگ",
        sampleBody: {
          title: { fa: "هوش مصنوعی سازمانی پیشرفته", en: "Advanced Enterprise AI" },
          status: "published",
        },
      },
      {
        method: "DELETE",
        path: "/api/admin/services/:id",
        title: "حذف خدمت",
        description: "حذف کامل خدمت از پایگاه داده (تنها با دسترسی admin)",
      },
    ],
  },

  projects: {
    id: "projects",
    title: "نمونه‌کارها و پروژه‌ها",
    titleEn: "Projects Collection",
    type: "collection",
    basePath: "/api/admin/projects",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/projects",
        title: "فهرست تمامی پروژه‌ها",
        description: "دریافت لیست نمونه‌کارها با فیلتر وضعیت و دسته‌بندی",
        queryParams: [
          { name: "status", type: "string", desc: "فیلتر published یا draft", sample: "published" },
          { name: "q", type: "string", desc: "جستجو در عنوان یا اسلاگ", sample: "crm" },
        ],
      },
      {
        method: "POST",
        path: "/api/admin/projects",
        title: "ایجاد پروژه جدید",
        description: "ایجاد نمونه‌کار با مشخصات مقیاس، صنعت و استک فنی",
        sampleBody: {
          slug: "logistics-erp",
          title: { fa: "سامانه یکپارچه لجستیک و انبار", en: "Integrated Logistics ERP" },
          summary: { fa: "مدیریت هوشمند ناوگان و انبارداری مرکزی", en: "Smart fleet management and warehouse tracking" },
          client: "شرکت لجستیک پیشرو",
          industry: "لجستیک و حمل‌ونقل",
          status: "published",
          metrics: [{ value: "۴۰٪", label: { fa: "کاهش زمان پردازش سفارش‌ها", en: "Order processing time reduction" } }],
          stack: ["Next.js", "Go", "PostgreSQL", "Kafka"],
        },
      },
      {
        method: "GET",
        path: "/api/admin/projects/:id",
        title: "دریافت جزئیات پروژه",
        description: "دریافت مشخصات کامل پروژه بر اساس ObjectId یا اسلاگ",
      },
      {
        method: "PATCH",
        path: "/api/admin/projects/:id",
        title: "ویرایش پروژه (PATCH/PUT)",
        description: "به‌روزرسانی داده‌های پروژه",
        sampleBody: {
          title: { fa: "سامانه یکپارچه لجستیک هوشمند", en: "Smart Logistics ERP" },
          status: "published",
        },
      },
      {
        method: "DELETE",
        path: "/api/admin/projects/:id",
        title: "حذف پروژه",
        description: "حذف نمونه‌کار از پایگاه داده",
      },
    ],
  },

  posts: {
    id: "posts",
    title: "مدیریت مقالات و محتوا",
    titleEn: "Posts Collection",
    type: "collection",
    basePath: "/api/admin/posts",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/posts",
        title: "فهرست تمامی مقالات",
        description: "دریافت لیست مقالات فنی و یادداشت‌ها با فیلتر وضعیت و تگ",
        queryParams: [
          { name: "status", type: "string", desc: "published یا draft", sample: "published" },
          { name: "q", type: "string", desc: "جستجو در عنوان و خلاصه", sample: "rag" },
        ],
      },
      {
        method: "POST",
        path: "/api/admin/posts",
        title: "ایجاد مقاله جدید",
        description: "ثبت مقاله همراه با تولید خودکار فهرست مطالب (TOC) و زمان مطالعه",
        sampleBody: {
          slug: "enterprise-rag-architecture",
          title: "معماری سیستم‌های بازیابی پیشرفته اطلاعات (RAG)",
          excerpt: "بررسی الگوهای صنعتی پیاده‌سازی سیستم‌های RAG و مدیریت مرزهای امنیتی داده.",
          author: { name: "تیم مهندسی کارا پرداز", role: "معماری سیستم" },
          tags: ["هوش مصنوعی", "RAG", "معماری"],
          status: "published",
          publishedAt: new Date().toISOString(),
          tiptapBody: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "مقدمه‌ای بر RAG..." }] }] },
        },
      },
      {
        method: "GET",
        path: "/api/admin/posts/:id",
        title: "دریافت جزئیات مقاله",
        description: "دریافت مقاله بر اساس ObjectId یا اسلاگ",
      },
      {
        method: "PATCH",
        path: "/api/admin/posts/:id",
        title: "ویرایش مقاله (PATCH/PUT)",
        description: "به‌روزرسانی متن و متا دیتای مقاله",
        sampleBody: {
          title: "معماری سیستم‌های پیشرفته RAG در محیط‌های سازمانی",
          status: "published",
        },
      },
      {
        method: "DELETE",
        path: "/api/admin/posts/:id",
        title: "حذف مقاله",
        description: "حذف مقاله از وب‌سایت",
      },
    ],
  },

  inquiries: {
    id: "inquiries",
    title: "پیام‌های تماس و درخواست‌ها",
    titleEn: "Inquiries Collection",
    type: "collection",
    basePath: "/api/admin/inquiries",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/inquiries",
        title: "فهرست پیام‌های دریافتی",
        description: "دریافت پیام‌های ارسالی از فرم تماس سایت با فیلتر وضعیت",
        queryParams: [
          { name: "status", type: "string", desc: "فیلتر بر اساس new, reviewed, contacted", sample: "new" },
          { name: "q", type: "string", desc: "جستجو در نام، ایمیل، شماره یا متن پیام", sample: "دارویی" },
        ],
      },
      {
        method: "POST",
        path: "/api/admin/inquiries",
        title: "ثبت پیام / استعلام جدید",
        description: "ثبت دستی پیام ورودی در سیستم",
        sampleBody: {
          name: "شرکت فناوری اطلاعات نوین",
          email: "info@novin-it.ir",
          phone: "09120000000",
          service: "هوش مصنوعی سازمانی و RAG",
          stage: "نیازسنجی و امکان‌سنجی اولیه",
          message: "درخواست مشاوره جهت یکپارچه‌سازی پایگاه دانش سازمانی.",
          status: "new",
        },
      },
      {
        method: "GET",
        path: "/api/admin/inquiries/:id",
        title: "دریافت جزئیات یک پیام",
        description: "دریافت کامل فیلدها و یادداشت‌های پیام بر اساس شناسه دیتابیس",
      },
      {
        method: "PATCH",
        path: "/api/admin/inquiries/:id",
        title: "تغییر وضعیت یا یادداشت پیام (PATCH/PUT)",
        description: "به‌روزرسانی وضعیت بررسی و یادداشت‌های اداری پیام",
        sampleBody: {
          status: "reviewed",
          notes: "جلسه فنی اولیه با مدیر پروژه برای دوشنبه هماهنگ شد.",
        },
      },
      {
        method: "DELETE",
        path: "/api/admin/inquiries/:id",
        title: "حذف پیام",
        description: "حذف کامل پیام استعلام از سیستم",
      },
    ],
  },

  about: {
    id: "about",
    title: "درباره ما و تیم",
    titleEn: "About Global",
    type: "global",
    basePath: "/api/admin/about",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/about",
        title: "دریافت اطلاعات درباره ما",
        description: "دریافت مانیفست، اصول کلیدی، ساختار تیم و فرهنگ سازمانی",
      },
      {
        method: "PATCH",
        path: "/api/admin/about",
        title: "به‌روزرسانی اطلاعات درباره ما (PATCH/PUT)",
        description: "ذخیره تغییرات بخش درباره ما",
        sampleBody: {
          manifesto: {
            headline: { fa: "مهندسی دقیق نرم‌افزار برای چالش‌های واقعی", en: "Precision Software Engineering" },
            lead: { fa: "ما سیستم‌های حیاتی سازمان‌ها را طراحی و پیاده‌سازی می‌کنیم.", en: "We engineer mission-critical systems." },
          },
        },
      },
    ],
  },

  process: {
    id: "process",
    title: "فرایند همکاری و متدولوژی",
    titleEn: "Process Global",
    type: "global",
    basePath: "/api/admin/process",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/process",
        title: "دریافت فرایند همکاری",
        description: "دریافت مراحل ۴ گانه همکاری، تعهدات شفاف و ماتریس پاسخگویی",
      },
      {
        method: "PATCH",
        path: "/api/admin/process",
        title: "به‌روزرسانی فرایند همکاری (PATCH/PUT)",
        description: "به‌روزرسانی متدولوژی و تعهدات کاری کارا پرداز",
        sampleBody: {
          hero: {
            title: { fa: "مسیر گام‌به‌گام و شفاف از ایده تا تحویل", en: "Transparent Step-by-Step Delivery" },
          },
        },
      },
    ],
  },

  legal: {
    id: "legal",
    title: "اسناد حقوقی و قوانین",
    titleEn: "Legal Documents Collection",
    type: "collection",
    basePath: "/api/admin/legal",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/legal",
        title: "فهرست اسناد حقوقی",
        description: "دریافت اسناد حقوقی (شرایط استفاده، حریم خصوصی، SLA)",
      },
      {
        method: "POST",
        path: "/api/admin/legal",
        title: "ثبت سند حقوقی جدید",
        description: "ایجاد یک سند حقوقی یا توافق‌نامه جدید",
        sampleBody: {
          slug: "sla-agreement",
          title: "توافق‌نامه سطح خدمات (SLA)",
          status: "published",
          tiptapBody: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "تعهدات آپ‌تایم و زمان پاسخگویی..." }] }] },
        },
      },
      {
        method: "GET",
        path: "/api/admin/legal/:slug",
        title: "دریافت سند حقوقی",
        description: "دریافت سند با اسلاگ اختصاصی مانند terms یا privacy",
      },
      {
        method: "PATCH",
        path: "/api/admin/legal/:slug",
        title: "به‌روزرسانی سند حقوقی (PATCH/PUT)",
        description: "به‌روزرسانی بندها و قوانین سند حقوقی",
        sampleBody: {
          title: "شرایط و ضوابط عمومی استفاده از خدمات",
          status: "published",
        },
      },
      {
        method: "DELETE",
        path: "/api/admin/legal/:slug",
        title: "حذف سند حقوقی",
        description: "حذف سند سفارشی (اسناد terms و privacy محافظت شده‌اند)",
      },
    ],
  },

  home: {
    id: "home",
    title: "صفحه اصلی و تنظیمات هویت",
    titleEn: "Home & Brand Settings Global",
    type: "global",
    basePath: "/api/admin/home",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/home",
        title: "دریافت تنظیمات صفحه اصلی و برند",
        description: "دریافت عناوین هیرو، گزاره‌های ارزش، ارقام کلیدی، سئو و اطلاعات تماس",
      },
      {
        method: "PATCH",
        path: "/api/admin/home",
        title: "به‌روزرسانی تنظیمات صفحه اصلی (PATCH/PUT)",
        description: "به‌روزرسانی هیرو، گزاره‌های کلیدی، تلفن تماس و تنظیمات سئو",
        sampleBody: {
          hero: {
            badge: { fa: "توسعه نرم‌افزار سازمانی و هوش مصنوعی", en: "Enterprise Software & AI" },
            titleMain: { fa: "زیرساخت‌های نرم‌افزاری پایدار برای", en: "Reliable Software Infrastructure for" },
            gradientWord: { fa: "سازمان‌های پیشرو", en: "Leading Enterprises" },
            lead: { fa: "ما راهکارهای اختصاصی مقیاس‌پذیر، سیستم‌های داده‌محور و هوش مصنوعی امن طراحی می‌کنیم.", en: "We design custom scalable software, data systems, and enterprise AI." },
          },
        },
      },
    ],
  },

  database: {
    id: "database",
    title: "پایگاه داده و سلامت سیستم",
    titleEn: "Database & System Utility",
    type: "utility",
    basePath: "/api/health/db",
    endpoints: [
      {
        method: "GET",
        path: "/api/health/db",
        title: "بررسی پایداری و زمان پاسخگویی MongoDB",
        description: "دریافت وضعیت اتصال زنده، تاخیر میلی‌ثانیه‌ای و نسخه دیتابیس",
      },
    ],
  },
};

/**
 * Automatically resolves the active resource config from the current URL pathname.
 */
export function getResourceConfigFromPath(pathname: string): {
  config: ResourceApiConfig;
  detectedId?: string;
  isEditPage: boolean;
  isNewPage: boolean;
} {
  // Normalize pathname: remove locale prefix e.g. /fa/admin/services -> /admin/services
  const cleanPath = pathname.replace(/^\/(?:fa|en)/, "");

  const parts = cleanPath.split("/").filter(Boolean); // ['admin', 'services', '123', 'edit']
  const section = parts[1] || "services";

  let config = API_REGISTRY[section];
  if (!config) {
    // Fallback if at /admin root
    config = API_REGISTRY.services;
  }

  const isEditPage = parts.includes("edit");
  const isNewPage = parts.includes("new");
  let detectedId: string | undefined = undefined;

  if (isEditPage) {
    const editIndex = parts.indexOf("edit");
    if (editIndex > 0) {
      detectedId = parts[editIndex - 1];
    }
  }

  return {
    config,
    detectedId,
    isEditPage,
    isNewPage,
  };
}
