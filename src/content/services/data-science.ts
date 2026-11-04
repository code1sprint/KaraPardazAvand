import type { Service } from "@/lib/content";

export const dataScienceService = {
  slug: "data-science",
  title: {
    fa: "علم داده و داشبورد",
    en: "Data science and dashboards",
  },
  outcome: {
    fa: "تبدیل داده‌های پراکنده و خام سازمانی به داشبوردهای مدیریتی زنده و الگوهای پیش‌بینی‌پذیر؛ تصمیم‌گیری‌های استراتژیک بر پایه واقعیت داده‌ها، نه حدس و گمان.",
    en: "Transforming fragmented enterprise data into live executive command centers and predictive intelligence; enabling confident data-backed decisions instead of guesswork.",
  },
  audience: [
    {
      fa: "مدیران ارشدی که گزارش‌های هفتگی یا ماهانه را با تاخیر چندروزه، پر از مغایرت و به صورت فایل‌های اکسل دستی و ناامن دریافت می‌کنند.",
      en: "Executives receiving stale, conflicting monthly reports via fragile spreadsheets, hampering strategic agility.",
    },
    {
      fa: "سازمان‌هایی که با انبوهی از تراکنش‌های مالی، فروش یا زنجیره تأمین روبه‌رو هستند اما نمی‌دانند دقیقاً کدام محصولات سودآور و کدام بخش‌ها هزینه‌سازند.",
      en: "Businesses sitting on millions of raw operational records without clear visibility into unit economics or channel profitability.",
    },
    {
      fa: "تیم‌های عملیات و بازاریابی که نیازمند رصد لحظه‌ای نرخ ریزش مشتری (Churn)، طول عمر مشتری (LTV) و پیش‌بینی تقاضای ماه آینده هستند.",
      en: "Marketing and operations teams needing real-time churn alerts, customer lifetime value tracking, and predictive demand forecasts.",
    },
    {
      fa: "واحدهای فناوری که می‌خواهند خطوط لوله داده (ETL) پایدار، انبار داده استاندارد و داشبوردهای نقش‌محور بدون بار اضافه روی پایگاه داده اصلی داشته باشند.",
      en: "IT teams seeking resilient automated ETL pipelines and decoupled analytical warehouses without stressing production OLTP systems.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "تعریف واژه‌نامه داده و مدل ریاضی KPIها",
        en: "Data Dictionary & Mathematical KPI Modeling",
      },
      description: {
        fa: "یکسان‌سازی تعاریف شاخص‌های مالی و عملیاتی بین واحدهای مختلف، فرمول‌بندی استاندارد و شناسایی منابع معتبر داده.",
        en: "Standardizing metric definitions and formulas across silos, mapping verified data origins.",
      },
    },
    {
      title: {
        fa: "خط لوله مکانیزه استخراج، پالایش و بارگذاری داده (ETL/ELT)",
        en: "Automated Resilient ETL / ELT Pipelines",
      },
      description: {
        fa: "انتقال خودکار و زمان‌بندی‌شده داده‌ها از دیتابیس‌های عملیاتی، اکسل‌ها و سامانه‌های جانبی به انبار داده تحلیلی.",
        en: "Scheduled ingestion from transactional databases, spreadsheets, and APIs into a high-speed analytical data warehouse.",
      },
    },
    {
      title: {
        fa: "داشبوردهای تعاملی و فرماندهی نقش‌محور (Executive Dashboards)",
        en: "Role-Based Executive Command Centers",
      },
      description: {
        fa: "طراحی نماهای بصری واکنش‌گرا و آنی برای مدیرعامل، مدیر مالی، مدیر فروش و سرپرستان با امکان فیلتر و دریل‌داون عمیق.",
        en: "Dynamic interactive dashboards for leadership, finance, and sales with deep-drill analytical filters.",
      },
    },
    {
      title: {
        fa: "مدل‌های تحلیلی پیش‌بینی‌پذیر و یادگیری ماشین (Predictive ML)",
        en: "Predictive Analytics & Machine Learning Models",
      },
      description: {
        fa: "پیش‌بینی روند فروش، پیش‌بینی کسری موجودی کالا و دسته‌بندی هوشمند مشتریان بر اساس رفتار واقعی خرید (RFM Analysis).",
        en: "Forecasting revenue trajectories, stockout probability, and automated RFM customer segmentation.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "سامانه پایش هوشمند انحرافات و هشدارهای بلادرنگ (Anomaly Alerts)",
        en: "Automated Anomaly Detection & Incident Alerts",
      },
      description: {
        fa: "ارسال آنی پیامک و نوتیفیکیشن در صورت افت ناگهانی فروش، افزایش مرجوعی یا افت نامتعارف شاخص‌های کلیدی عملکرد.",
        en: "Instant alerts triggered upon sudden sales dips, abnormal margin erosion, or metric drift.",
      },
    },
    {
      title: {
        fa: "حاکمیت داده، تفکیک دسترسی‌ها و مستندات فنی (Data Lineage)",
        en: "Data Governance, RBAC & Lineage Documentation",
      },
      description: {
        fa: "مستندسازی کامل مسیر هر عدد از مبدأ اولیه تا نمودار داشبورد، همراه با اعمال دقیق سطوح محرمانگی برای کاربران.",
        en: "Full auditability from raw origin to visual chart, coupled with strict confidentiality scopes.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "کشف سوالات کلیدی کسب‌وکار و نقشه شاخص‌ها", en: "Business Discovery & Metric Blueprint" },
      description: {
        fa: "شناسایی تصمیمات حیاتی مدیران، اولویت‌بندی KPIها و تعیین شاخص‌هایی که مستقیماً بر سودآوری اثر دارند.",
        en: "Isolating high-stakes executive decisions and mapping actionable KPIs that directly impact bottom-line profit.",
      },
    },
    {
      title: { fa: "ممیزی منابع، ارزیابی کیفیت و اتصال خطوط داده", en: "Source Audit, Data Quality & Pipeline Build" },
      description: {
        fa: "بررسی فرمت‌ها، پاکسازی داده‌های متناقض و راه‌اندازی فرآیندهای استخراج خودکار بدون افت سرعت سیستم‌های اصلی.",
        en: "Clearing conflicting records and spinning up non-intrusive extraction pipelines without degrading production DBs.",
      },
    },
    {
      title: { fa: "توسعه انبار داده و طراحی ارگونومیک داشبوردها", en: "Data Warehouse & Dashboard UX Engineering" },
      description: {
        fa: "مدلسازی چندبعدی داده‌ها و پیاده‌سازی رابط کاربری داشبوردها با نمودارهای خوانا، تعاملی و بدون ابهام بصری.",
        en: "Dimensional modeling and ergonomic frontend implementation delivering instant clarity and zero visual noise.",
      },
    },
    {
      title: { fa: "اعتبارسنجی ارقام، آموزش تیم و استقرار پایدار", en: "Data Audit, Executive Onboarding & Handover" },
      description: {
        fa: "تطبیق ۱۰۰٪ اعداد داشبورد با دفاتر رسمی مالی، آموزش مدیران و تحویل مستندات خط لوله داده با پشتیبانی پیوسته.",
        en: "Reconciling metrics with official books, leadership onboarding, and complete pipeline handoff with ongoing SLA.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "انبار داده و پایگاه تحلیلی", en: "Data Warehouse & Storage" },
      items: ["PostgreSQL (OLAP)", "ClickHouse", "DuckDB", "TimescaleDB"],
    },
    {
      label: { fa: "خط لوله ETL و پردازش", en: "Pipelines & Analytics Engine" },
      items: ["Python (Pandas, Polars)", "Apache Airflow", "dbt", "FastAPI"],
    },
    {
      label: { fa: "فرانت‌اند بصری‌سازی", en: "Visualization & UI" },
      items: ["Next.js (App Router)", "Apache ECharts", "Tailwind CSS", "Recharts"],
    },
  ],
  systemMap: {
    windowTitle: "kara://data-bi",
    layout: "etl",
    descriptionLead: {
      fa: "از دیتابیس‌های پراکنده تا میز فرماندهی تصمیم‌گیرندگان.",
      en: "From scattered databases to the executive cockpit.",
    },
    description: {
      fa: "پالایش مداوم داده‌ها، محاسبه خودکار شاخص‌ها و ارائه نماهای تحلیلی بلادرنگ.",
      en: "Continuous ingestion, automatic metric calculation, and sub-second live reporting.",
    },
    nodes: {
      inputTop: { fa: "داده‌های تراکنشی و فروش", en: "Transactional Sales & CRM" },
      inputBottom: { fa: "سیستم‌های مالی و انبار", en: "ERP, Accounting & Inventory" },
      core: { fa: "موتور پردازش داده و ETL", en: "ETL & Analytics Core" },
      outputTop: { fa: "داشبورد هیئت‌مدیره و KPI", en: "Executive KPI Dashboard" },
      outputBottom: { fa: "مدل‌های پیش‌بینی و هشدارها", en: "Predictive Models & Alerts" },
    },
    logs: [
      {
        fa: "etl.ingest  source=postgres_prod  records=148000  status=clean",
        en: "etl.ingest  source=postgres_prod  records=148000  status=clean",
      },
      {
        fa: "kpi.computed  metric=monthly_recurring_revenue  variance=+18.4%",
        en: "kpi.computed  metric=monthly_recurring_revenue  variance=+18.4%",
      },
      {
        fa: "dashboard.streamed  latency=18ms  viewers=executive_board",
        en: "dashboard.streamed  latency=18ms  viewers=executive_board",
      },
    ],
  },
  faqs: [
    {
      id: "ds-powerbi-diff",
      question: {
        fa: "تفاوت داشبوردهای اختصاصی با ابزارهایی مانند Power BI چیست؟",
        en: "How do custom analytical dashboards differ from off-the-shelf Power BI?",
      },
      answer: {
        fa: "ابزارهایی مانند Power BI نیازمند لایسنس‌های دلاری، وی‌پی‌ان یا اینترنت پایدار هستند و سفارشی‌سازی ظاهر و سطح دسترسی نقش‌ها در آن‌ها پیچیده و کند است. داشبوردهای بومی ما، کاملاً واکنش‌گرا و فوق‌سریع در بستر وب داخلی سازمان اجرا می‌شوند، نیازمند لایسنس نبوده و امکان تعبیه مستقیم درون سایر پرتال‌های سازمانی را دارند.",
        en: "Tools like Power BI require recurring license fees, constant internet connectivity, and present sluggish UX embedding. Our custom web-native dashboards execute with sub-second speeds, zero recurring fees, and seamless white-label integration into existing enterprise portals.",
      },
    },
    {
      id: "ds-data-messy",
      question: {
        fa: "داده‌های فعلی سازمان ما بسیار پراکنده و پر از خطا در اکسل است؛ آیا امکان اجرای پروژه وجود دارد؟",
        en: "Our current data is fragmented and full of errors across Excel sheets; can this still work?",
      },
      answer: {
        fa: "دقیقاً یکی از ماموریت‌های اصلی ما در فاز اول، پاکسازی داده‌ها (Data Cleaning) و تدوین اسکریپت‌های اعتبارسنجی خودکار است. ما ناهماهنگی‌ها را شناسایی کرده و خط لوله‌ای می‌سازیم که داده‌های معیوب را پیش از ورود به داشبورد فیلتر و اصلاح کند.",
        en: "Absolutely. One of our core strengths in phase one is automated data cleaning and validation pipeline engineering, purging anomalies before they ever surface in management reports.",
      },
    },
    {
      id: "ds-refresh-frequency",
      question: {
        fa: "داشبوردها با چه فاصله‌ای به‌روزرسانی می‌شوند؟",
        en: "How frequently do the dashboards refresh?",
      },
      answer: {
        fa: "بسته به نیاز کسب‌وکار شما؛ از به‌روزرسانی‌های بلادرنگ (Real-Time در کسری از ثانیه) برای مانیتورینگ خطوط فروش و عملیات، تا همگام‌سازی‌های دوره‌ای ساعتی یا شبانه برای تحلیل‌های جامع مالی.",
        en: "Configured strictly to your operational cadence—ranging from real-time streaming updates for transaction desks to automated nightly consolidations for financial ledgers.",
      },
    },
    {
      id: "ds-security-privacy",
      question: {
        fa: "امنیت و محرمانگی ارقام حساس مالی شرکت چگونه حفظ می‌شود؟",
        en: "How is confidentiality and security maintained for sensitive financial figures?",
      },
      answer: {
        fa: "انبار داده و داشبوردها به طور کامل درون شبکه امن یا سرورهای اختصاصی خود شما مستقر می‌شوند و ماتریس دسترسی به تفکیک واحدها و افراد اعمال می‌گردد تا هر مدیر صرفاً اعداد مربوط به حوزه مسئولیت خود را مشاهده نماید.",
        en: "The entire analytical pipeline is hosted on your private infrastructure with strict column- and row-level access permissions ensuring executives only access their authorized domain.",
      },
    },
  ],
  relatedProjects: ["telecom-bi-platform", "ops-crm-pilot"],
  bento: {
    order: 2,
    span: 2,
    image: "/brand/bento/data-science.svg",
    shortTitle: {
        fa: "علم داده و داشبورد",
        en: "Data science and dashboards"
    }
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">پایان تصمیم‌گیری بر مبنای حس و گمانه‌زنی</p>
      <p class="text-sm text-muted m-0 leading-relaxed">سازمان‌هایی که در بحران‌های اقتصادی و نوسانات بازار پیروز می‌شوند، آن‌هایی هستند که زودتر از دیگران تغییرات جریان نقدینگی، سودآوری و رفتار مشتریان را در داده‌های خود رصد می‌کنند. داشبورد اختصاصی هوش تجاری، چشم‌های بیدار اتاق مدیریت شماست.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">سه رکن داشبوردهای تحلیلی کارا پرداز اوند</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. تک‌منبع موثق حقیقت (Single Source of Truth)</p>
        <p class="text-sm text-muted leading-relaxed m-0">پایان مناقشات بین مدیر مالی و فروش درباره صحت آمار؛ تمام ارقام مستقیماً و با خط لوله مستند از پایگاه داده اصلی تجمیع می‌شوند.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. سرعت لود آنی و زیر یک ثانیه</p>
        <p class="text-sm text-muted leading-relaxed m-0">استفاده از معماری OLAP و ایندکس‌های ستونی مدرن، بررسی میلیون‌ها تراکنش را در کسری از ثانیه و بدون معطلی ممکن می‌سازد.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. هشدارهای هوشمند پیش از وقوع بحران</p>
        <p class="text-sm text-muted leading-relaxed m-0">به جای آنکه در انتهای ماه غافلگیر شوید، سیستم به محض افت غیرعادی یک شاخص، به مدیر مربوطه اعلان هوشمند می‌فرستد.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">جلسه ممیزی داده و کشف شاخص</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در یک کارگاه فنی، منابع داده فعلی سازمان و فرمول‌های حیاتی رشد کسب‌وکار خود را با مهندسان داده ما بررسی کنید.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست جلسه مشاوره هوش تجاری و داده" data-cta-url="/contact?service=data-science" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=data-science" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست جلسه مشاوره هوش تجاری و داده</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
