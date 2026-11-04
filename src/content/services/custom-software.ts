import type { Service } from "@/lib/content";

export const customSoftwareService = {
  slug: "custom-software",
  title: {
    fa: "طراحی نرم‌افزار سفارشی",
    en: "Custom software design",
  },
  outcome: {
    fa: "توسعه نرم‌افزارهای سازمانی دقیق، چابک و با مقیاس‌پذیری بالا؛ متناسب با منطق واقعی بیزینس شما و با تضمین ۱۰۰٪ مالکیت سورس‌کد و داده‌ها.",
    en: "Enterprise-grade custom software engineered around your real business logic, with guaranteed 100% source code ownership and architectural resilience.",
  },
  audience: [
    {
      fa: "سازمان‌هایی که فرایندهای اختصاصی، مدل قیمت‌گذاری یا زنجیره تأمین منحصربه‌فرد دارند و در محصولات آماده دچار محدودیت و قفل‌شدگی می‌شوند.",
      en: "Organizations with proprietary workflows or pricing models that cannot fit into rigid commercial software templates.",
    },
    {
      fa: "مدیران ارشد فناوری (CTO) و عملیات که به کدنویسی تمیز، معماری شفاف، پایگاه داده بهینه‌شده و رفع بدهی‌های فنی قبلی نیاز دارند.",
      en: "CTOs and operations leads seeking clean maintainable code, transparent architecture, and freedom from legacy tech debt.",
    },
    {
      fa: "کسب‌وکارهایی که می‌خواهند چندین پایگاه داده و نرم‌افزار جزیره‌ای را در یک پلتفرم متمرکز، امن و یکپارچه تجمیع کنند.",
      en: "Enterprises aiming to consolidate siloed databases and disjointed internal tools into one robust unified system.",
    },
    {
      fa: "شرکت‌هایی که نگران امنیت، محرمانگی داده‌های حیاتی مشتریان و خطرات تحریم یا قطعی سرویس‌های خارجی هستند.",
      en: "Businesses requiring complete data sovereignty, strict privacy controls, and resilience against external provider lock-ins.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "مدل‌سازی دامنه و شفاف‌سازی قوانین کسب‌وکار",
        en: "Domain-Driven Modeling & Business Logic",
      },
      description: {
        fa: "ترسیم دقیق نمودار موجودیت‌ها، قواعد تصمیم‌گیری و مرزهای سرویس بدون هیچ‌گونه ابهام پیش از آغاز کدنویسی.",
        en: "Precise entity mapping, decision matrices, and service boundaries eliminating guesswork before coding.",
      },
    },
    {
      title: {
        fa: "معماری مقیاس‌پذیر و پایدار (Clean Architecture)",
        en: "Scalable Clean Architecture",
      },
      description: {
        fa: "طراحی ماژولار با قابلیت تحمل ترافیک بالا، جداسازی لایه‌ها، قراردادهای شفاف API و امکان توسعه نامحدود در آینده.",
        en: "Modular high-concurrency design, clean layering, strict API contracts, and limitless future maintainability.",
      },
    },
    {
      title: {
        fa: "رابط کاربری مدرن، فوق‌سریع و ارگونومیک (UI/UX)",
        en: "Ergonomic & Blazing-Fast UI/UX",
      },
      description: {
        fa: "طراحی اختصاصی صفحات بر اساس اصول دسترسی‌پذیری و ارگونومی کاربری با هدف کاهش زمان انجام وظایف اپراتورها.",
        en: "Tailored interfaces adhering to accessibility and ergonomics to minimize operator task completion times.",
      },
    },
    {
      title: {
        fa: "تحویل مرحله‌ای با نسخه‌های عملیاتی منظم",
        en: "Iterative Delivery & Milestone Demos",
      },
      description: {
        fa: "تحویل نسخه‌های قابل تست در پایان هر اسپرینت، دریافت بازخورد سریع از کاربران واقعی و جلوگیری از انحراف پروژه.",
        en: "Shippable working software at every sprint, enabling rapid real-world validation and mitigating project risk.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "تست‌های خودکار و تضمین کیفیت همه‌جانبه (QA)",
        en: "Automated Testing & End-to-End QA",
      },
      description: {
        fa: "پوشش تست‌های واحد، یکپارچه‌سازی و سناریوهای بحرانی جهت اطمینان از عملکرد بدون باگ و پایداری زیر بار سنگین.",
        en: "Unit, integration, and stress tests ensuring bulletproof reliability and flawless performance under peak load.",
      },
    },
    {
      title: {
        fa: "مستندسازی جامع، پایپ‌لاین CI/CD و انتقال دانش",
        en: "Comprehensive Docs, CI/CD & Knowledge Handoff",
      },
      description: {
        fa: "مستندات کامل معماری و APIها، استقرار خودکار و جلسات انتقال دانش فنی به تیم مهندسی سازمان شما.",
        en: "Full architectural docs, automated deployment pipelines, and thorough knowledge transfer to your in-house engineers.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "کشف، مدل دامنه و تعیین حدود سیستم", en: "Discovery, Domain & Scoping" },
      description: {
        fa: "فرایندهای واقعی، گلوگاه‌ها و شاخص‌های دقیق موفقیت را در جلسات فشرده با ذی‌نفعان قفل می‌کنیم.",
        en: "We map real workflows, pinpoint friction, and lock explicit success metrics with core stakeholders.",
      },
    },
    {
      title: { fa: "معماری فنی و نمونه اولیه تعاملی", en: "Architecture & Interactive Prototype" },
      description: {
        fa: "اسکلت دیتابیس، ساختار سرویس‌ها و جریان‌های اصلی UX را پیش از توسعه تست و تایید می‌کنیم.",
        en: "We validate the database schema, service contracts, and key UI flows before full-scale build.",
      },
    },
    {
      title: { fa: "توسعه چابک و تحویل‌های فازبندی‌شده", en: "Agile Build & Iterative Releases" },
      description: {
        fa: "پیاده‌سازی ماژول‌ها در بازه‌های دوهفته‌ای با دموهای عملیاتی و معیارهای پذیرش شفاف انجام می‌شود.",
        en: "Modules are engineered in rapid 2-week iterations backed by working demos and strict acceptance tests.",
      },
    },
    {
      title: { fa: "استقرار صنعتی، تست بار و پشتیبانی پایدار", en: "Production Rollout & Long-Term SLA" },
      description: {
        fa: "پایش عملکرد زیر بار ترافیک واقعی، آموزش عملی پرسنل و ارائه خدمات نگهداری بر اساس SLA دقیق.",
        en: "Stress testing in production, structured team onboarding, and continuous SLA-backed maintenance.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "فریم‌ورک و زبان", en: "Framework & Language" },
      items: ["TypeScript", "Next.js", "Node.js", "Python"],
    },
    {
      label: { fa: "پایگاه داده و صف پردازش", en: "Database & Queue" },
      items: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"],
    },
    {
      label: { fa: "زیرساخت و امنیت", en: "DevOps & Security" },
      items: ["Docker", "Kubernetes", "CI/CD Pipeline", "JWT / RBAC"],
    },
  ],
  systemMap: {
    windowTitle: "kara://custom-core",
    layout: "modules",
    descriptionLead: {
      fa: "معماری یکپارچه برای پردازش‌های حیاتی سازمان.",
      en: "Unified architecture for mission-critical operations.",
    },
    description: {
      fa: "جداسازی دامنه‌ها، سرعت پردازش بی‌وقفه و همگام‌سازی تضمین‌شده داده‌ها.",
      en: "Decoupled domains, ultra-low latency execution, and guaranteed consistency.",
    },
    nodes: {
      inputTop: { fa: "درگاه‌های سازمانی و وب", en: "Enterprise Web & Portals" },
      inputBottom: { fa: "اتصال به سرویس‌ها و API", en: "APIs & Legacy Services" },
      core: { fa: "هستهٔ نرم‌افزار سفارشی", en: "Custom Core Engine" },
      outputTop: { fa: "پردازش رویدادها و صف", en: "Event Queues & Workers" },
      outputBottom: { fa: "پایگاه داده و انبار داده", en: "Transactional Database" },
    },
    logs: [
      {
        fa: "event.dispatched  domain=orders  id=ORD-9021",
        en: "event.dispatched  domain=orders  id=ORD-9021",
      },
      {
        fa: "worker.processed  latency=14ms  status=committed",
        en: "worker.processed  latency=14ms  status=committed",
      },
      {
        fa: "audit.logged  actor=admin/ops  action=state_change",
        en: "audit.logged  actor=admin/ops  action=state_change",
      },
    ],
  },
  faqs: [
    {
      id: "custom-timeline",
      question: {
        fa: "یک پروژه نرم‌افزار سفارشی معمولاً چقدر زمان می‌برد؟",
        en: "How long does a custom software build typically take?",
      },
      answer: {
        fa: "بسته به پیچیدگی و وسعت دامنه، نسخه اولیه قابل استفاده (MVP) معمولاً بین ۶ تا ۱۰ هفته آماده می‌شود. ما پروژه را فازبندی می‌کنیم تا سازمان شما در همان ماه‌های ابتدایی ارزش عملیاتی آن را لمس کند.",
        en: "Depending on scope, a production-grade MVP is typically delivered within 6 to 10 weeks. Staged rollouts ensure you capture operational value early.",
      },
    },
    {
      id: "custom-ownership",
      question: {
        fa: "آیا مالکیت سورس‌کد و دیتابیس به صورت کامل به ما واگذار می‌شود؟",
        en: "Do we get 100% ownership of source code and databases?",
      },
      answer: {
        fa: "بله، ۱۰۰٪ مالکیت حقوقی و فنی سورس‌کد، ساختار دیتابیس و مستندات معماری متعلق به کارفرماست و هیچ‌گونه وابستگی انحصاری برای شما ایجاد نمی‌شود.",
        en: "Yes. 100% of the intellectual property, source repository, schema, and docs belong entirely to you with zero proprietary lock-in.",
      },
    },
    {
      id: "custom-tech-stack",
      question: {
        fa: "تکنولوژی‌ها و استک فنی بر چه اساسی انتخاب می‌شوند؟",
        en: "How is the technical stack selected?",
      },
      answer: {
        fa: "بر اساس بار پردازشی، نیازمندی‌های مقیاس‌پذیری و ظرفیت تیم فنی سازمان شما؛ ما استانداردترین تکنولوژی‌های مدرن جهان با جامعه توسعه‌دهندگان بزرگ را انتخاب می‌کنیم تا نگهداری آن در آینده آسان باشد.",
        en: "Selection is driven by concurrency, scalability profiles, and your internal engineering capacity, prioritizing battle-tested modern standards.",
      },
    },
    {
      id: "custom-legacy-migration",
      question: {
        fa: "تکلیف سیستم‌های قدیمی و دیتای قبلی ما چه خواهد شد؟",
        en: "What happens to our legacy data and existing systems?",
      },
      answer: {
        fa: "طراحی رابط‌های واسط (API Adapter) و سناریوهای مهاجرت داده بخشی از تعهد ماست. ما فرایند را طوری برنامه‌ریزی می‌کنیم که تغییر سیستم بدون حتی یک دقیقه توقف در کار جاری سازمان انجام شود.",
        en: "We design robust API adapters and zero-downtime data migration pipelines to ensure business continuity without disruption.",
      },
    },
  ],
  relatedProjects: ["ops-crm-pilot", "telecom-bi-platform"],
  bento: {
    order: 5,
    span: 6,
    dark: true,
    image: "/brand/bento/custom-software.svg",
    shortTitle: {
        fa: "نرم‌افزار سفارشی",
        en: "Custom software"
    }
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">چرا نرم‌افزار سفارشی سرمایه‌گذاری استراتژیک است، نه هزینه؟</p>
      <p class="text-sm text-muted m-0 leading-relaxed">نرم‌افزارهای تجاری عمومی برای پاسخ به میانگین بازار ساخته شده‌اند و به همین دلیل در گلوگاه‌های خاص کسب‌وکار شما ناکارآمدند. یک نرم‌افزار سفارشی با طراحی متمرکز بر مزیت رقابتی شما، سرعت و بهره‌وری فرایندها را تا چندین برابر ارتقا می‌دهد.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">اصول مهندسی کارا پرداز اوند در توسعه نرم‌افزار</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. معماری تمیز و بدون بدهی فنی</p>
        <p class="text-sm text-muted leading-relaxed m-0">طراحی ماژولار و رعایت استانداردهای Clean Code و SOLID تا در آینده هر تغییری بدون ترس از شکستن بخش‌های دیگر به راحتی اعمال شود.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. تست‌های خودکار و تضمین پایداری</p>
        <p class="text-sm text-muted leading-relaxed m-0">پوشش مداوم تست‌های خودکار از روز اول، مانع بروز باگ در محیط عملیاتی و حفظ کیفیت سامانه تحت بارهای تراکنشی سنگین می‌شود.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. تحویل ملموس و بدون غافلگیری</p>
        <p class="text-sm text-muted leading-relaxed m-0">کارفرما هر دو هفته یک‌بار محصول را در حال کار مشاهده و تست می‌کند؛ بنابراین پروژه هرگز از زمان‌بندی و انتظارات واقعی منحرف نخواهد شد.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">مشاوره فنی و نیازسنجی معماری</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در یک جلسه تحلیل فنی، ابعاد معماری، چالش‌های زیرساختی و راهکارهای مهندسی پروژه شما را ارزیابی می‌کنیم.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست ارزیابی معماری و پروپوزال فنی" data-cta-url="/contact?service=custom-software" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=custom-software" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست ارزیابی معماری و پروپوزال فنی</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
