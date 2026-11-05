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
          deepDiveHtml: "<p>تحلیل عمیق معماری، نیازمندی‌های عملیاتی و جریان داده‌های سیستم سازمانی در ادیتور Tiptap.</p>",
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
          deepDiveHtml: "<p>به‌روزرسانی مستندات فنی و راهنمای پیاده‌سازی سرویس در ویرایشگر اداری.</p>",
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
          title: "سامانه یکپارچه لجستیک و انبار",
          sector: "لجستیک و حمل‌ونقل",
          role: "طراحی و توسعه معماری سیستم",
          problem: "عدم یکپارچگی داده‌های شعب و تاخیر در رهگیری سفارش‌های کلان سازمانی.",
          solution: "معماری رویدادمحور توزیع‌شده با پایگاه داده بلادرنگ و داشبورد عملیات مرکزی.",
          results: [{ value: "۴۰٪", label: "کاهش زمان پردازش سفارش‌ها" }],
          stack: ["Next.js", "Go", "PostgreSQL", "Kafka"],
          contentHtml: "<p>شرح کامل فرایند معماری، زیرساخت پردازشی و نتایج استقرار سامانه در ویرایشگر Tiptap.</p>",
          status: "published",
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
          title: "سامانه یکپارچه لجستیک هوشمند",
          contentHtml: "<p>به‌روزرسانی روایت فنی و ویژگی‌های اجرایی پروژه از طریق API.</p>",
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
          summary: "بررسی الگوهای صنعتی پیاده‌سازی سیستم‌های RAG و مدیریت مرزهای امنیتی داده.",
          author: { name: "تیم مهندسی کارا پرداز", role: "معماری سیستم" },
          tags: ["هوش مصنوعی", "RAG", "معماری"],
          status: "published",
          publishedAt: new Date().toISOString(),
          contentHtml: "<h2>مقدمه‌ای بر RAG سازمانی</h2><p>سیستم‌های بازیابی تقویت‌شده با تولید (RAG) پلی میان مدل‌های زبانی بزرگ و داده‌های اختصاصی سازمان‌ها ایجاد می‌کنند.</p><p>این متن مستقیماً در ادیتور Tiptap بارگذاری و نمایش داده می‌شود.</p>",
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
          contentHtml: "<h2>به‌روزرسانی محتوا از طریق API</h2><p>متن ویرایش‌شده مقاله با موفقیت از طریق درخواست API دریافت شده و در ادیتور به صورت زنده نمایش داده می‌شود.</p>",
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
        description: "ذخیره تغییرات بخش درباره ما و داستان شکل‌گیری",
        sampleBody: {
          story: {
            title: { fa: "داستان کارا پرداز اوند", en: "The Story of Kara Pardaz" },
            tiptapBody: {
              fa: {
                html: "<h2>مهندسی نرم‌افزار سازمانی با تمرکز بر شفافیت</h2><p>کارا پرداز اوند با هدف حل مسائل بنیادین سیستم‌های بزرگ‌مقیاس فعالیت می‌کند.</p><p>این متن مستقیماً در ادیتور Tiptap صفحه درباره ما بارگذاری می‌شود.</p>",
                json: null,
              },
            },
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
        description: "به‌روزرسانی متدولوژی، تعهدات کاری و راهنمای تحویل",
        sampleBody: {
          guide: {
            title: { fa: "راهنمای فرایند و استانداردهای تحویل", en: "Delivery Guidelines" },
            tiptapBody: {
              fa: {
                html: "<h2>استانداردهای شفافیت در تحویل فازها</h2><p>در هر اسپرینت، کدهای منبع، لاگ‌های آزمایش و مستندات معماری در اختیار کارفرما قرار می‌گیرد.</p>",
                json: null,
              },
            },
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
          title: { fa: "توافق‌نامه سطح خدمات (SLA)", en: "Service Level Agreement (SLA)" },
          summary: { fa: "تعهدات پایداری، آپ‌تایم و زمان پاسخگویی سامانه‌ها", en: "System uptime and response time commitments" },
          status: "published",
          tiptapBody: {
            fa: {
              html: "<h2>تعهدات پایداری و زمان پاسخگویی</h2><p>کارا پرداز اوند پایداری ۹۹.۹٪ را برای کلیه زیرساخت‌های ابری و سازمانی متعهد می‌شود.</p>",
              json: null,
            },
            en: {
              html: "<h2>Uptime and Service Guarantees</h2><p>Kara Pardaz commits to a 99.9% uptime for cloud infrastructure.</p>",
              json: null,
            },
          },
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
          title: { fa: "شرایط و ضوابط عمومی استفاده از خدمات", en: "General Terms of Service" },
          tiptapBody: {
            fa: {
              html: "<h2>به‌روزرسانی مواد و شرایط حقوقی</h2><p>کلیه تعهدات طرفین مطابق با نسخه جدید قرارداد حقوقی کارا پرداز اوند اجرا خواهد شد.</p>",
              json: null,
            },
          },
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

  tickets_admin: {
    id: "tickets-admin",
    title: "مدیریت تیکت‌ها و پروژه‌ها (پنل کاراپرداز)",
    titleEn: "KaraPardaz Operator Ticketing Management API",
    type: "collection",
    basePath: "/api/admin/tickets",
    endpoints: [
      {
        method: "GET",
        path: "/api/admin/tickets",
        title: "فهرست و فیلتر جامع تیکت‌های اپراتور",
        description: "دریافت تیکت‌ها با فیلتر پروژه (projectId)، وضعیت (status)، دپارتمان، اولویت، جستجوی متنی و آمار تجمیعی",
        queryParams: [
          { name: "projectId", type: "string", desc: "شناسه پروژه (مثلاً amlak، shop، یا all)", sample: "amlak" },
          { name: "status", type: "string", desc: "فیلتر وضعیت (OPEN، IN_PROGRESS، ANSWERED، RESOLVED، CLOSED یا all)", sample: "OPEN" },
          { name: "priority", type: "string", desc: "فیلتر اولویت (URGENT، HIGH، MEDIUM، LOW یا all)", sample: "URGENT" },
          { name: "q", type: "string", desc: "جستجو در شماره تیکت، موضوع، نام مشاور، شماره تماس و سازمان", sample: "املاک" },
          { name: "page", type: "number", desc: "شماره صفحه", sample: "1" },
          { name: "limit", type: "number", desc: "تعداد در هر صفحه", sample: "20" },
        ],
      },
      {
        method: "GET",
        path: "/api/admin/tickets/:id",
        title: "دریافت جزئیات تیکت و تمام پیام‌ها",
        description: "مشاهده سوابق کامل پیام‌ها و اطلاعات مشتری بر اساس شناسه ObjectId یا شماره تیکت",
      },
      {
        method: "POST",
        path: "/api/admin/tickets/:id/reply",
        title: "ارسال پاسخ رسمی پشتیبانی کاراپرداز",
        description: "ثبت پاسخ اپراتور با هویت نشست مدیر و تغییر وضعیت تیکت به ANSWERED یا وضعیت دلخواه",
        sampleBody: {
          message: "سلام و احترام. مورد گزارش‌شده توسط تیم فنی بررسی و اصلاح گردید.",
          status: "ANSWERED",
        },
      },
      {
        method: "PATCH",
        path: "/api/admin/tickets/:id/status",
        title: "تغییر سریع وضعیت یا اولویت تیکت",
        description: "تغییر وضعیت تیکت به IN_PROGRESS، RESOLVED یا CLOSED و تنظیم اولویت",
        sampleBody: {
          status: "RESOLVED",
          priority: "HIGH",
        },
      },
      {
        method: "GET",
        path: "/api/admin/tickets/projects",
        title: "فهرست پروژه‌ها/سامانه‌ها و آمار تیکت‌ها",
        description: "دریافت لیست تمام سامانه‌های ثبت‌شده همراه با تعداد کل تیکت‌ها و تیکت‌های باز هر سامانه",
      },
      {
        method: "POST",
        path: "/api/admin/tickets/projects",
        title: "ثبت سامانه جدید و صدور کلید امنیتی API",
        description: "تعریف سامانه مشتری جدید (دستی یا از نمونه‌کارها) و صدور کلید API اختصاصی هش‌شده با Bcrypt",
        sampleBody: {
          name: "فروشگاه اینترنتی پوشاک",
          projectId: "shop",
        },
      },
    ],
  },

  tickets: {
    id: "tickets",
    title: "وب‌سرویس و تیکتینگ مشتریان (Client REST API)",
    titleEn: "Multi-Tenant Client Support Tickets API",
    type: "collection",
    basePath: "/api/v1/tickets",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/tickets",
        title: "ثبت تیکت جدید توسط سامانه مشتری",
        description: "ثبت تیکت پشتیبانی جدید به همراه هویت کاربر، دپارتمان، اولویت و متن پیام اولیه. نیاز به سربرگ‌های x-project-id و x-project-key دارد.",
        sampleBody: {
          requester: {
            userId: "usr_client_101",
            name: "سهراب مرادی",
            phone: "09121112233",
            email: "client@example.com",
            organization: "فروشگاه مرکزی",
          },
          department: "technical",
          priority: "HIGH",
          subject: "عدم بارگذاری تصاویر محصولات در پنل کاربری",
          message: "هنگام ذخیره اطلاعات محصول با خطای شبکه مواجه می‌شویم.",
        },
      },
      {
        method: "GET",
        path: "/api/v1/tickets",
        title: "دریافت فهرست تیکت‌های یک کاربر",
        description: "دریافت تیکت‌های ثبت‌شده با فیلتر شناسه کاربر (userId) و امکان صفحه‌بندی",
        queryParams: [
          { name: "userId", type: "string", desc: "شناسه کاربر در سامانه مشتری (اجباری)", sample: "usr_client_101" },
          { name: "status", type: "string", desc: "فیلتر بر اساس وضعیت (OPEN, IN_PROGRESS, ANSWERED, RESOLVED, CLOSED)", sample: "OPEN" },
          { name: "page", type: "number", desc: "شماره صفحه", sample: "1" },
          { name: "limit", type: "number", desc: "تعداد در هر صفحه", sample: "20" },
        ],
      },
      {
        method: "GET",
        path: "/api/v1/tickets/:id",
        title: "دریافت جزئیات تیکت و رشته پیام‌ها",
        description: "دریافت اطلاعات تیکت و تاریخچه تمام پیام‌ها و پاسخ‌های ردوبدل شده",
        queryParams: [
          { name: "userId", type: "string", desc: "شناسه کاربر (جهت بررسی دسترسی امن)", sample: "usr_client_101" },
        ],
      },
      {
        method: "POST",
        path: "/api/v1/tickets/:id/messages",
        title: "ارسال پیام پیگیری جدید در تیکت",
        description: "ثبت پاسخ جدید توسط مشتری روی تیکت فعال یا بازگشایی تیکت حل‌شده تا ۷ روز",
        sampleBody: {
          userId: "usr_client_101",
          userName: "سهراب مرادی",
          message: "مشکل در مرورگر دیگر هم تست شد و اسکرین‌شات ضمیمه گردید.",
        },
      },
      {
        method: "PATCH",
        path: "/api/v1/tickets/:id/close",
        title: "بستن تیکت توسط کاربر",
        description: "تغییر وضعیت تیکت به CLOSED و پایان چرخه پیگیری",
        sampleBody: {
          userId: "usr_client_101",
        },
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
  if (section === "tickets") {
    config = API_REGISTRY.tickets_admin;
  }
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
