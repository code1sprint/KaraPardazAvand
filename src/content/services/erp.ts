import type { Service } from "@/lib/content";

export const erpService = {
  slug: "erp",
  title: {
    fa: "ERP",
    en: "ERP",
  },
  outcome: {
    fa: "یکپارچه‌سازی بلادرنگ انبار، تدارکات، فروش و مالی بر پایه فرایند واقعی سازمان؛ حذف خطاهای انسانی، دوباره‌کاری‌های دفتری و تسریع تصمیم‌گیری مدیران.",
    en: "Real-time synchronization of inventory, procurement, sales, and finance; eliminating manual human errors, bureaucratic lag, and empowering executive mastery.",
  },
  audience: [
    {
      fa: "سازمان‌های تولیدی و بازرگانی که انبار، تدارکات و امور مالی آن‌ها روی سامانه‌های جداگانه کار می‌کنند و همواره با مغایرت موجودی مواجهند.",
      en: "Manufacturing and trading companies struggling with inventory discrepancies across disconnected warehouse and accounting silos.",
    },
    {
      fa: "مدیران عملیاتی که گردش کار کاغذی، امضاهای دستی و تأییدهای طولانی باعث کندی زنجیره تأمین و اتلاف فرصت‌های تجاری آن‌ها شده است.",
      en: "Operations directors constrained by paper signoffs, manual purchase authorizations, and supply chain friction.",
    },
    {
      fa: "مدیران عاملی که برای تصمیم‌گیری هفتگی و استراتژیک به داده‌های معتبر، شفاف و تجمیع‌شده از عملکرد واقعی خطوط مختلف دسترسی ندارند.",
      en: "CEOs and board members requiring reliable, single-source-of-truth business intelligence for strategic cash-flow and operational planning.",
    },
    {
      fa: "شرکت‌هایی که نرم‌افزارهای خارجی (مانند SAP/Oracle) برایشان بیش‌ازحد سنگین و گران است و محصولات بسته‌بندی‌شده داخلی نیز انعطاف کافی ندارند.",
      en: "Firms finding global enterprise ERPs bloated and prohibitively expensive, yet unable to fit into rigid domestic off-the-shelf software.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "نقشه‌برداری فرایند عملیات و مرز ماژول‌ها",
        en: "Operations Process Mapping & Architecture",
      },
      description: {
        fa: "مستندسازی بدون ابهام زنجیره ارزش، نقاط تماس انبار، بازرگانی و مالی و تعیین اولویت استقرار ماژول‌ها.",
        en: "Unambiguous documentation of value streams, warehouse-to-finance touchpoints, and phased modular roadmap.",
      },
    },
    {
      title: {
        fa: "مدیریت چندانبار، کاردکس کالا و نقطه سفارش هوشمند",
        en: "Multi-Warehouse, Bin Tracking & Reorder Engine",
      },
      description: {
        fa: "ردگیری لحظه‌ای موجودی واقعی و رزروشده، هشدارهای کسری کالا و صدور خودکار درخواست خرید بر اساس حداقل نقطه سفارش.",
        en: "Real-time ledger of on-hand and reserved inventory, stockout alerts, and automated procurement triggering.",
      },
    },
    {
      title: {
        fa: "موتور گردش کار تأییدات و اسناد (Approval Engine)",
        en: "Multi-Tier Approval & Workflow Engine",
      },
      description: {
        fa: "اتوماسیون امضاهای دیجیتال، سقف اختیارات مالی و جریان ارجاع تاییدات بین سرپرستان بدون نیاز به کاغذبازی.",
        en: "Digital signatures, tiered financial spending caps, and automated multi-step signoffs eliminating paper bureaucracy.",
      },
    },
    {
      title: {
        fa: "ماژول بازرگانی، تدارکات و مدیریت زنجیره تأمین",
        en: "Procurement, Vendor Management & SCM",
      },
      description: {
        fa: "ثبت استعلام‌ها، ارزیابی کیفی تامین‌کنندگان، تطبیق سه‌طرفه فاکتور-رسید-سفارش و کنترل بهای تمام‌شده خرید.",
        en: "RFP tracking, supplier grading, 3-way invoice-PO-receipt matching, and landed-cost calculations.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "اتصال به سامانه‌های مالی، بانکی و مودیان",
        en: "Tax, Banking & Financial Ledger Connectivity",
      },
      description: {
        fa: "صدور خودکار اسناد حسابداری، اتصال به سامانه مودیان مالیاتی و همگام‌سازی مانده حساب‌های طرف‌حساب بدون دوباره‌کاری.",
        en: "Automated journal entries, direct tax authority portal compliance, and seamless reconciliation.",
      },
    },
    {
      title: {
        fa: "داشبورد هوش عملیاتی و رصد شاخص‌های کلیدی (BI)",
        en: "Operational Intelligence & Executive Dashboards",
      },
      description: {
        fa: "دید جامع مدیریتی از ارزش موجودی راکد، نقدینگی جاری، سرعت گردش کالا و سودآوری به تفکیک خطوط تولید یا خدمات.",
        en: "Unified visibility into dormant inventory valuation, operational runway, turn rates, and line profitability.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "عارضه‌یابی و تدوین نقشه عملیاتی", en: "Operational Audit & Value Mapping" },
      description: {
        fa: "تحلیل موشکافانه گردش کالا، اسناد و تاییدات از مبدأ خرید تا مقصد مشتری و استخراج ماتریس گلوگاه‌ها.",
        en: "Auditing material flows, documents, and approvals from sourcing to delivery to expose hidden bottlenecks.",
      },
    },
    {
      title: { fa: "معماری مدل داده یکپارچه و قوانین دسترسی", en: "Unified Data Schema & Security Matrix" },
      description: {
        fa: "تعریف استانداردهای کالا، مراکز هزینه، سطوح دسترسی و سناریوهای تاییدات بر اساس ارگونومی کارکرد تیم‌ها.",
        en: "Standardizing SKUs, cost centers, permission tiers, and UX approval flows around operator ergonomics.",
      },
    },
    {
      title: { fa: "توسعه و استقرار فازبندی‌شده ماژول‌ها", en: "Phased Build & Modular Rollout" },
      description: {
        fa: "استقرار گام‌به‌گام ماژول‌ها با اولویت باز کردن بزرگ‌ترین گلوگاه، همراه با تست‌های دقیق صحت داده‌ها در محیط واقعی.",
        en: "Rolling out high-priority modules first to clear acute bottlenecks, verified by live data audits.",
      },
    },
    {
      title: { fa: "مهاجرت داده، آموزش عملیاتی و پشتیبانی میدانی", en: "Data Migration, Onboarding & SLA" },
      description: {
        fa: "انتقال امن مانده‌ها و اسناد باز، آموزش کارگاهی پرسنل در تمام سطوح و پشتیبانی فنی مداوم جهت تثبیت سیستم.",
        en: "Migrating open balances safely, hands-on staff training across departments, and SLA-backed maintenance.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "هسته معماری و وب", en: "Core Architecture & Web" },
      items: ["TypeScript", "Next.js", "Node.js Microservices"],
    },
    {
      label: { fa: "پایگاه داده رابطه‌ای و صف", en: "Relational DB & Queues" },
      items: ["PostgreSQL (ACID-compliant)", "Redis Cache", "RabbitMQ"],
    },
    {
      label: { fa: "یکپارچه‌سازی و امنیت", en: "Integration & Governance" },
      items: ["REST / GraphQL", "Webhooks", "Audit Trail Logging", "Role-Based Access Control"],
    },
  ],
  systemMap: {
    windowTitle: "kara://erp-core",
    layout: "pipeline",
    descriptionLead: {
      fa: "جریان متصل عملیات از انبار تا تراز مالی.",
      en: "Connected operational pipeline from stock to balance sheet.",
    },
    description: {
      fa: "تطبیق بلادرنگ موجودی، صدور خودکار اسناد مالی و حذف کامل مغایرت‌ها.",
      en: "Real-time stock reconciliation, automated ledger posting, and zero discrepancy.",
    },
    nodes: {
      inputTop: { fa: "سفارش‌ها و درخواست خرید", en: "Orders & Requisitions" },
      inputBottom: { fa: "ورود کالا و باسکول انبار", en: "Receiving & Warehouse" },
      core: { fa: "موتور مرکزی ERP", en: "ERP Central Engine" },
      outputTop: { fa: "گردش کار تاییدات و بازرگانی", en: "Workflow & SCM" },
      outputBottom: { fa: "اسناد مالی و انبارداری", en: "Financials & Costing" },
    },
    logs: [
      {
        fa: "inventory.reconciled  sku=SKU-1084  discrepancy=0",
        en: "inventory.reconciled  sku=SKU-1084  discrepancy=0",
      },
      {
        fa: "approval.granted  req=PO-4091  approver=finance_head",
        en: "approval.granted  req=PO-4091  approver=finance_head",
      },
      {
        fa: "journal.posted  doc=INV-8120  status=balanced",
        en: "journal.posted  doc=INV-8120  status=balanced",
      },
    ],
  },
  faqs: [
    {
      id: "erp-difference",
      question: {
        fa: "تفاوت ERP اختصاصی کارا پرداز اوند با نرم‌افزارهای یکپارچه مالی چیست؟",
        en: "How does Kara Pardaz custom ERP differ from traditional financial packages?",
      },
      answer: {
        fa: "نرم‌افزارهای سنتی معمولاً متمرکز بر سندداری حسابداری هستند و عملیات اجرایی انبار، بازرگانی و تاییدات را پشتیبانی نمی‌کنند. ERP اختصاصی، نرم‌افزار را به عنوان موتور محرک عملیات در خطوط مقدم شرکت می‌نشاند و ثبت‌های مالی را به عنوان خروجی طبیعی و خودکار عملیات استخراج می‌کند.",
        en: "Traditional packages are accounting-centric ledgers that fail to model operational shop-floor and procurement realities. Our custom ERP drives daily execution first, generating accounting entries automatically as a byproduct of real operations.",
      },
    },
    {
      id: "erp-migration-risk",
      question: {
        fa: "چگونه ریسک توقف سازمان در زمان مهاجرت به ERP جدید کنترل می‌شود؟",
        en: "How do we mitigate operational downtime risk during ERP migration?",
      },
      answer: {
        fa: "با متدولوژی استقرار مرحله‌ای (Phased Rollout). سیستم جدید به صورت موازی با یک ماژول غیربحرانی آغاز می‌شود و پس از اعتبارسنجی کامل داده‌ها و تطابق ۱۰۰٪ مغایرت‌ها، انتقال بخش‌های دیگر مرحله‌به‌مرحله انجام می‌پذیرد.",
        en: "Via phased parallel deployment. We pilot non-critical modules first, verifying data consistency with legacy ledgers before safely cutting over mission-critical modules.",
      },
    },
    {
      id: "erp-customization-future",
      question: {
        fa: "اگر چند سال بعد فرایندهای ما تغییر کرد، آیا سیستم قابل توسعه خواهد بود؟",
        en: "If our workflows evolve in the future, can the ERP adapt?",
      },
      answer: {
        fa: "کاملاً؛ معماری ماژولار و مالکیت کامل سورس‌کد به شما این امکان را می‌دهد که در هر زمان ماژول‌های جدید اضافه کنید، قوانین را اصلاح نمایید یا سیستم را به ابزارهای هوش مصنوعی و اتوماسیون‌های نوین متصل کنید.",
        en: "Absolutely. Full source ownership and clean modular architecture allow adding new modules, adjusting validation policies, or plugging into AI tools whenever your business scales.",
      },
    },
    {
      id: "erp-training-support",
      question: {
        fa: "برنامه آموزش پرسنل و پشتیبانی پس از استقرار به چه صورت است؟",
        en: "What does the onboarding and post-launch support look like?",
      },
      answer: {
        fa: "آموزش‌های کاربردی برای هر نقش به‌صورت مجزا برگزار شده و ویدیوها و دستورالعمل‌های گام‌به‌گام تدوین می‌شود. تیم پشتیبانی فنی کارا پرداز اوند تا زمان انطباق کامل و اطمینان از آرامش عملیاتی سازمان در کنار شماست.",
        en: "Role-specific training sessions, hands-on playbooks, and video tutorials are provided. Our engineering team remains stationed through stabilization until operational cadence is fully achieved.",
      },
    },
  ],
  relatedProjects: ["ops-crm-pilot", "telecom-bi-platform"],
  bento: {
    order: 3,
    span: 2,
    image: "/brand/bento/erp.svg",
    shortTitle: {
        fa: "ERP",
        en: "ERP"
    }
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">حل ریشه‌ای تعارض بین انبار، بازرگانی و مالی</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در اکثر سازمان‌ها، اطلاعات انبار با حسابداری همخوانی ندارد چون داده‌ها با تاخیر یا به صورت غیرسیستمی منتقل می‌شوند. پیاده‌سازی یک هسته ERP اختصاصی باعث می‌شود هر جابه‌جایی فیزیکی در انبار، بلادرنگ به سند مالی و وضعیت سفارش تبدیل شود.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">مزایای راهبردی استقرار ERP ماژولار</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. انطباق دقیق با ساختار سازمان</p>
        <p class="text-sm text-muted leading-relaxed m-0">به جای انطباق سازمان شما با الگوهای خشک محصولات آماده، سیستم بر اساس گردش کار، سقف اختیارات و فرایند واقعی شما توسعه می‌یابد.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. کنترل کامل زنجیره ارزش و هزینه</p>
        <p class="text-sm text-muted leading-relaxed m-0">محاسبه دقیق بهای تمام‌شده کالا و خدمات با لحاظ هزینه‌های حمل، استهلاک و سربار جهت توقف نشتی‌های مالی پنهان.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. مالکیت دائمی و استقلال کامل</p>
        <p class="text-sm text-muted leading-relaxed m-0">بدون هزینه‌های تمدید لایسنس سالانه و بدون نگرانی از تحریم؛ سورس نرم‌افزار و کلیه داده‌ها در کنترل قطعی شماست.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">جلسه ارزیابی عملیاتی و راهکار</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در یک کارگاه ارزیابی، گردش کار فعلی و سناریوی پیاده‌سازی مرحله‌ای را با متخصصان ارشد معماری سیستم‌های سازمانی بررسی کنید.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست ارزیابی عملیاتی و جلسه مشاوره" data-cta-url="/contact?service=erp" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=erp" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست ارزیابی عملیاتی و جلسه مشاوره</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
