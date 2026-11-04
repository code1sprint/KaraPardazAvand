import type { Service } from "@/lib/content";

export const crmService = {
  slug: "crm",
  title: {
    fa: "CRM",
    en: "CRM",
  },
  outcome: {
    fa: "تبدیل سرنخ‌های پراکنده به یک جریان فروش پیش‌بینی‌پذیر؛ معماری اختصاصی متصل به سیستم مالی، تلفن و فرآیند واقعی تیم شما، بدون هزینه‌های لایسنس مداوم.",
    en: "Turn scattered leads into a predictable sales engine; custom architecture unified with your ERP, VoIP, and real sales workflow with zero recurring seat licenses.",
  },
  audience: [
    {
      fa: "تیم‌های فروشی که به دلیل پراکندگی سرنخ‌ها بین اکسل، پیام‌رسان‌ها و یادداشت‌های شخصی، تا ۳۰٪ از مشتریان بالقوه را در مرحله پیگیری از دست می‌دهند.",
      en: "Sales teams whose leads get lost across spreadsheets, messengers, and personal notes, leaking valuable deals.",
    },
    {
      fa: "مدیران عامل و مدیران عملیات که برای ارزیابی عملکرد واقعی کارشناسان، نرخ تبدیل مراحل قیف و ارزش ریالی پایپ‌لاین به گزارش‌های لحظه‌ای و دقیق نیاز دارند.",
      en: "Executives and operations managers needing real-time visibility into conversion rates, deal velocity, and team throughput.",
    },
    {
      fa: "شرکت‌هایی که از محدودیت‌ها و هزینه‌های ماهانه لایسنس پلتفرم‌های خارجی یا CRMهای اشتراکی خسته شده‌اند و مالکیت کامل سورس‌کد و داده را می‌خواهند.",
      en: "Companies burdened by escalating recurring SaaS seat licenses seeking full ownership of their software assets and customer data.",
    },
    {
      fa: "مجموعه‌هایی که چرخه فروش یا قیمت‌گذاری پیچیده (B2B، پروژه‌ای یا اعتباری) دارند و نیازمند اتصال دوطرفه به نرم‌افزار حسابداری (سپیدار، راهکاران) و مرکز تلفن (VoIP) هستند.",
      en: "Enterprises with complex B2B pricing and custom sales flows requiring seamless two-way integration with accounting software and PBX/VoIP.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "پرونده ۳۶۰ درجه مشتری و تاریخچه تعاملات",
        en: "360° Customer Profile & Interaction History",
      },
      description: {
        fa: "تجمیع تاریخچه تماس‌های صوتی، پیام‌ها، پیش‌فاکتورها و یادداشت‌های پیگیری در یک نمای یکپارچه و سریع بدون نیاز به جابه‌جایی میان نرم‌افزارها.",
        en: "Unify voice call logs, messaging, draft invoices, and follow-up notes in a single blazing-fast view with zero app switching.",
      },
    },
    {
      title: {
        fa: "قیف فروش کانبان چندمرحله‌ای با موانع انتقال",
        en: "Multi-Stage Kanban Pipeline with Exit Criteria",
      },
      description: {
        fa: "پیکربندی مراحل فروش متناسب با کسب‌وکار، تشخیص خودکار فرصت‌های راکد و ثبت الزامات خروج از هر مرحله برای استانداردسازی رفتار کارشناسان.",
        en: "Tailor custom deal stages, detect stalled deals automatically, and enforce exit criteria to standardize sales reps' behavior.",
      },
    },
    {
      title: {
        fa: "موتور تخصیص هوشمند سرنخ و اتوماسیون وظایف",
        en: "Intelligent Lead Routing & Task Automation",
      },
      description: {
        fa: "توزیع عادلانه و تخصصی سرنخ‌ها بین کارشناسان، ایجاد تسک‌های پیگیری خودکار و ارسال نوتیفیکیشن لحظه‌ای به محض ورود لید از وب‌سایت یا شبکه‌ها.",
        en: "Distribute incoming leads evenly by expertise, auto-schedule follow-up tasks, and trigger instant alerts across teams.",
      },
    },
    {
      title: {
        fa: "یکپارچه‌سازی با سامانه مالی و مرکز تلفن (VoIP)",
        en: "Native ERP, Accounting & VoIP Integration",
      },
      description: {
        fa: "پاپ‌آپ مشخصات مشتری هنگام زنگ خوردن تلفن کارشناس، آرشیو مکالمات و صدور مستقیم پیش‌فاکتور بدون دوباره‌کاری در نرم‌افزار حسابداری.",
        en: "Caller ID pop-up on incoming calls, automatic audio archiving, and direct quotation generation synced with your accounting books.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "داشبورد تحلیلی و پیش‌بینی فروش (Sales Analytics)",
        en: "Executive Analytics & Revenue Forecasting",
      },
      description: {
        fa: "گزارش تصویری از نرخ تبدیل هر مرحله، زمان میانگین پاسخ‌گویی، ارزش وزنی فرصت‌های جاری و پایش KPIهای کارشناسان برای تصمیم‌گیری آگاهانه.",
        en: "Visual insights into stage conversion rates, mean response times, weighted pipeline value, and agent KPIs for informed decisions.",
      },
    },
    {
      title: {
        fa: "مرزبندی دسترسی و امنیت حاکمیتی داده‌ها",
        en: "Granular RBAC & Data Sovereignty",
      },
      description: {
        fa: "تعریف دقیق محدوده دید هر نقش، جلوگیری از سرقت یا دانلود انبوه پایگاه مشتریان و ثبت لاگ امنیتی تمامی تغییرات و دسترسی‌ها.",
        en: "Define precise role visibility boundaries, prevent unauthorized bulk data exports, and audit all data mutations.",
      },
    },
  ],
  steps: [
    {
      title: {
        fa: "کشف فرایند و مدلسازی قیف فروش",
        en: "Process Discovery & Funnel Modeling",
      },
      description: {
        fa: "برگزاری کارگاه کشف نیاز، شناسایی گلوگاه‌های ریزش مشتری و قفل کردن معیارهای پذیرش فرصت موفق متناسب با منطق تجاری شما.",
        en: "Conducting discovery workshops, diagnosing drop-off bottlenecks, and establishing qualification criteria tailored to your business.",
      },
    },
    {
      title: {
        fa: "طراحی میز کار کارشناس و معماری داده (UX)",
        en: "Sales Workspace & Data Architecture",
      },
      description: {
        fa: "طراحی رابط کاربری چابک و ارگونومیک برای کارشناسان با هدف به حداقل رساندن کلیک‌ها و ساده‌سازی ثبت رویدادها حین مکالمه.",
        en: "Designing an ergonomic, fast UI tailored to reduce clicks and make logging interactions effortless during active calls.",
      },
    },
    {
      title: {
        fa: "توسعه ماژولار و پیوند با زیرساخت‌های سازمان",
        en: "Modular Development & Integration",
      },
      description: {
        fa: "پیاده‌سازی امن بک‌اند و فرانت‌اند، اتصال وب‌هوک‌ها به وب‌سایت و ایجاد ارتباط دوطرفه با پایگاه داده مالی و سانترال.",
        en: "Implementing a resilient backend and frontend, wiring webhooks to inbound channels, and bridging bidirectional sync with ERP and PBX.",
      },
    },
    {
      title: {
        fa: "پایلوت میدانی، مهاجرت داده و استقرار نهایی",
        en: "Field Pilot, Data Migration & Go-Live",
      },
      description: {
        fa: "پاکسازی و انتقال بدون خطای اطلاعات قبلی مشتریان، اجرای آزمایشی در کنار تیم فروش منتخب، آموزش جامع پرسنل و پشتیبانی فنی مداوم.",
        en: "Scrubbing and migrating legacy contact data, piloting with key sales champions, full staff training, and continuous operational support.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "معماری برنامه و فرانت‌اند", en: "Frontend & Architecture" },
      items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      label: { fa: "پایگاه داده و بک‌اند", en: "Database & Backend" },
      items: ["PostgreSQL / MongoDB", "Redis Cache", "Node.js Microservices"],
    },
    {
      label: { fa: "یکپارچه‌سازی و پروتکل‌ها", en: "Integrations & Protocols" },
      items: ["VoIP (Asterisk / Issabel)", "Accounting Webhooks (Sepidar / Rahkaran)", "REST / GraphQL", "Role-Based Access Control"],
    },
  ],
  systemMap: {
    windowTitle: "kara://crm-engine",
    layout: "funnel",
    descriptionLead: {
      fa: "جریان متمرکز جذب تا بستن قرارداد.",
      en: "Unified pipeline from capture to deal close.",
    },
    description: {
      fa: "ثبت بلادرنگ سرنخ‌ها، هدایت به کارشناس مناسب و همگام‌سازی لحظه‌ای با سیستم مالی.",
      en: "Real-time lead intake, smart agent routing, and instant sync with accounting.",
    },
    nodes: {
      inputTop: { fa: "ورودی وب‌سایت و فرم‌ها", en: "Web forms & Inbound" },
      inputBottom: { fa: "تماس تلفنی و سانترال", en: "VoIP & Call Centers" },
      core: { fa: "موتور مرکزی CRM", en: "CRM Core Engine" },
      outputTop: { fa: "کارتابل هوشمند کارشناسان", en: "Agent Workspace & Tasks" },
      outputBottom: { fa: "همگام‌سازی با مالی و انبار", en: "ERP & Accounting Sync" },
    },
    logs: [
      {
        fa: "lead.ingested  source=landing_page  id=LP-8421  score=high",
        en: "lead.ingested  source=landing_page  id=LP-8421  score=high",
      },
      {
        fa: "agent.assigned  owner=commercial/enterprise  match=industry",
        en: "agent.assigned  owner=commercial/enterprise  match=industry",
      },
      {
        fa: "erp.sync  action=create_customer_draft  status=success",
        en: "erp.sync  action=create_customer_draft  status=success",
      },
    ],
  },
  faqs: [
    {
      id: "crm-vs-ready",
      question: {
        fa: "چرا به جای پلتفرم‌های عمومی، یک CRM اختصاصی سفارش دهیم؟",
        en: "Why choose a custom CRM over generic SaaS platforms?",
      },
      answer: {
        fa: "محصولات آماده فرایندهای از پیش تعیین‌شده‌ای دارند که تیم شما را وادار به تغییر روش کار می‌کند. علاوه بر این، هزینه اشتراک ماهانه با رشد سازمان سنگین می‌شود و اتصال آن‌ها به سیستم‌های حسابداری و تلفنی داخلی پر از چالش است. در CRM اختصاصی، نرم‌افزار دقیقاً بر اساس مدل فروش شما شکل می‌گیرد، هیچ هزینه کاربری ماهانه‌ای ندارد و داده‌ها در سرورهای خودتان محافظت می‌شوند.",
        en: "Off-the-shelf platforms force your team into rigid templates, accumulate expensive recurring per-seat fees, and struggle to integrate with local ERP/VoIP systems. A custom CRM conforms exactly to your workflow, eliminates seat fees, and gives you total data sovereignty.",
      },
    },
    {
      id: "crm-migrate",
      question: {
        fa: "آیا اطلاعات قبلی ما در فایل‌های اکسل یا CRM قبلی قابل انتقال است؟",
        en: "Can our existing data in Excel or old CRMs be migrated?",
      },
      answer: {
        fa: "بله، در فاز استقرار فرایند پاکسازی، حذف رکوردهای تکراری و نگاشت فیلدهای قدیمی به مدل داده جدید انجام می‌شود تا پرسنل فروش بدون از دست دادن تاریخچه ارتباط با مشتریان، کار را در سیستم جدید ادامه دهند.",
        en: "Yes. During the rollout phase, we perform automated deduplication, normalization, and field mapping so your sales reps retain complete historical records without missing a beat.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "crm-mobile",
      question: {
        fa: "اگر کارشناسان فروش در برابر استفاده از سیستم جدید مقاومت کنند چه؟",
        en: "What if sales reps resist adopting the new CRM?",
      },
      answer: {
        fa: "علت اصلی مقاومت پرسنل در نرم‌افزارهای سنتی، فرم‌های طولانی و پیچیدگی‌های بی‌مورد است. ما رابط کاربری CRM را با رویکرد «حداقل کلیک» و مبتنی بر کار روزمره کارشناسان طراحی می‌کنیم. همچنین حضور در کنار تیم در قالب جلسات آموزشی کاربردی و سنجش بازخوردها در فاز پایلوت، نرخ پذیرش پرسنل را به بالاترین سطح می‌رساند.",
        en: "Resistance happens when software introduces clutter and manual busywork. We design lean, low-friction interfaces that automate repetitive data entry, combined with hands-on pilot training to ensure immediate adoption.",
      },
    },
    {
      id: "crm-support",
      question: {
        fa: "پشتیبانی، توسعه قابلیت‌های جدید و امنیت نرم‌افزار چگونه تضمین می‌شود؟",
        en: "How are ongoing support, security, and future features handled?",
      },
      answer: {
        fa: "سامانه با کدنویسی استاندارد، معماری ماژولار و تست‌های خودکار تحویل داده می‌شود. پس از تحویل نهایی، قرارداد پشتیبانی فنی، مانیتورینگ عملکرد و توسعه فازهای تکمیلی طبق توافق‌نامه سطح خدمات (SLA) منعقد می‌گردد.",
        en: "The platform is built using modern modular standards with complete documentation. Post-launch, structured SLAs guarantee technical maintenance, performance monitoring, and iterative feature development.",
      },
      needs_business_confirmation: true,
    },
  ],
  relatedProjects: ["ops-crm-pilot"],
  bento: {
    order: 0,
    span: 4,
    image: "/brand/bento/crm.svg",
    shortTitle: {
      fa: "CRM",
      en: "CRM",
    },
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">چرا توسعه اختصاصی CRM بیشترین بازدهی سرمایه (ROI) را ایجاد می‌کند؟</p>
      <p class="text-sm text-muted m-0 leading-relaxed">نرم‌افزار مدیریت ارتباط با مشتری اگر با ریتم روزانه تیم فروش و زنجیره داده‌های مالی هم‌خوان نباشد، تبدیل به هزینه سربار می‌شود. توسعه سفارشی یعنی نرم‌افزار خود را با مزیت رقابتی و فرایند اختصاصی شما تطبیق می‌دهد، نه آنکه سازمان شما ناچار به تغییر فرایند خود شود.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">سه برتری حیاتی CRM اختصاصی کارا پرداز اوند</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. مالکیت ۱۰۰٪ و بدون هزینه لایسنس</p>
        <p class="text-sm text-muted leading-relaxed m-0">بدون شارژهای ماهانه به ازای هر کاربر. با رشد تیم از ۵ نفر به ۵۰ نفر، هیچ هزینه اضافه‌ای به شرکت تحمیل نمی‌شود و سورس‌کد دارایی قطعی سازمان شماست.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. یکپارچگی بلادرنگ با تلفن و مالی</p>
        <p class="text-sm text-muted leading-relaxed m-0">اتصال مستقیم به سانترال/VoIP برای نمایش اطلاعات مشتری حین زنگ خوردن و همگام‌سازی لحظه‌ای با نرم‌افزارهای حسابداری (سپیدار، راهکاران و...) بدون ورود دستی داده.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. ارگونومی و سرعت کاربری بی‌رقیب</p>
        <p class="text-sm text-muted leading-relaxed m-0">رابط کاربری فوق‌سریع بدون فیلدهای بیهوده. کارشناس فروش در کمتر از ۵ ثانیه وضعیت تماس یا یادداشت پیگیری را ثبت می‌کند تا پذیرش ابزار به ۱۰۰٪ برسد.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">مشاوره تخصصی و تحلیل فرایند</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در یک جلسه ۳۰ دقیقه‌ای، گلوگاه‌های قیف فروش، نحوه اتصال به سیستم‌های موجود و تخمین شفاف زمان و هزینه را با مهندسان ما بررسی کنید.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست جلسه مشاوره و بررسی فنی" data-cta-url="/contact?service=crm" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=crm" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست جلسه مشاوره و بررسی فنی</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
