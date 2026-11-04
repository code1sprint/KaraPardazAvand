import type { Service } from "@/lib/content";

export const webPlatformsService = {
  slug: "web-platforms",
  title: {
    fa: "وب‌سایت و پلتفرم وب",
    en: "Websites and web platforms",
  },
  outcome: {
    fa: "توسعه وب‌سایت‌ها و پلتفرم‌های اینترپرایز با بالاترین سرعت لود، سئوی فنی بی‌نقص و طراحی در تراز بین‌المللی؛ تبدیل بازدیدکنندگان به مشتریان وفادار.",
    en: "Engineering enterprise web platforms with blazingly fast load times, flawless technical SEO, and world-class digital craft that turn visitors into high-value clients.",
  },
  audience: [
    {
      fa: "برندها و هلدینگ‌هایی که به وب‌سایت چندزبانه، پرستیژ بصری در سطح شرکت‌های تراز اول جهانی و سئوی فنی پایدار نیاز دارند.",
      en: "Enterprise brands and holding groups requiring multilingual web authority, sophisticated design craft, and sustainable organic search dominance.",
    },
    {
      fa: "شرکت‌های فناوری، پلتفرم‌های SaaS و ارائه‌دهندگان خدمات B2B که وب‌سایت را پیشانی برند و ماشین اصلی جذب لید می‌دانند.",
      en: "B2B service providers and SaaS platforms treating their web surface as their primary lead-generation engine and brand flagship.",
    },
    {
      fa: "سازمان‌هایی که از سایت‌های کند وردپرسی با پلاگین‌های ناپایدار و امنیتی شکننده خسته شده‌اند و پلتفرمی مدرن و سفارشی می‌خواهند.",
      en: "Organizations outgrowing fragile, bloated WordPress sites seeking secure, custom-engineered, sub-second web experiences.",
    },
    {
      fa: "تیم‌های بازاریابی و محتوایی که نیازمند پنل مدیریت محتوای روان، مدرن، بدون خطای فنی و اتصال به درگاه‌های پرداخت و فرم‌های سرنخ هستند.",
      en: "Marketing teams demanding an intuitive, error-free content publishing admin seamlessly wired into payment gateways and inbound CRM funnels.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "معماری فرانت‌اند فوق‌سریع و امتیاز ۱۰۰ در Core Web Vitals",
        en: "Ultra-Fast Frontend & 100% Core Web Vitals",
      },
      description: {
        fa: "پیاده‌سازی با Next.js App Router و Server Components با زمان لود زیر ۱ ثانیه حتی در اینترنت‌های ضعیف.",
        en: "Engineered via Next.js App Router and Server Components ensuring sub-second LCP and zero layout shift.",
      },
    },
    {
      title: {
        fa: "سئوی ساختاریافته، اسکیما و ایندکس چندزبانه (Enterprise SEO)",
        en: "Structured Enterprise SEO & Multilingual Routing",
      },
      description: {
        fa: "نقشه سایت پیشرفته، تگ‌های متا و OpenGraph داینامیک، استانداردهای Schema.org و مسیرهای مجزای محلی‌سازی‌شده (fa/en).",
        en: "Automated sitemaps, dynamic OpenGraph cards, rich JSON-LD schema markup, and index-perfect localized routing.",
      },
    },
    {
      title: {
        fa: "طراحی رابط و تجربه کاربری بین‌المللی (UI/UX Design)",
        en: "World-Class UI/UX Design System",
      },
      description: {
        fa: "طراحی ریسپانسیو و ارگونومیک، انیمیشن‌های روان و مهارشده، تایپوگرافی اصیل فارسی و رعایت استانداردهای دسترس‌پذیری (WCAG AA).",
        en: "Pixel-perfect responsive design tokens, subdued motion choreography, rich typography, and full WCAG AA accessibility.",
      },
    },
    {
      title: {
        fa: "سیستم مدیریت محتوای اختصاصی و پنل ادمین مدرن (Headless CMS)",
        en: "Modern Headless CMS & Admin Engine",
      },
      description: {
        fa: "ادیتور متنی پیشرفته، مدیریت رسانه، انتشار زمان‌بندی‌شده، نسخه‌بندی مقالات و تعریف نقش‌های دبیر، نویسنده و مدیر.",
        en: "Rich block editor, media management, scheduled releases, revision history, and granular editorial role permissions.",
      },
    },
    {
      title: {
        fa: "اتصال به درگاه‌های پرداخت، احراز هویت و APIهای داخلی",
        en: "Payment Gateways, Auth & API Integrations",
      },
      description: {
        fa: "یکپارچگی با درگاه‌های بانکی، احراز هویت پیامکی (OTP)، سرویس‌های ایمیل مارکتینگ و ارتباط مستقیم با CRM سازمانی.",
        en: "Direct integrations with bank gateways, SMS OTP providers, marketing automation tools, and CRM pipelines.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "زیرساخت استقرار مقیاس‌پذیر، امنیت و پشتیبان‌گیری خودکار",
        en: "Scalable Deployment, Security & Auto Backups",
      },
      description: {
        fa: "خط لوله CI/CD بدون قطعی (Zero-Downtime)، فایروال WAF، گواهی SSL پیشرفته و پشتیبان‌گیری منظم دیتابیس.",
        en: "Zero-downtime CI/CD deployment pipelines, automated database snapshots, and enterprise web application firewall hardening.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "تدوین هویت بصری، استراتژی محتوا و نقشه راه", en: "Design System, Content Strategy & Roadmap" },
      description: {
        fa: "تعریف ارزش‌های برند، ساختار درخت صفحات، تحلیل کلمات کلیدی سئو و تعیین قیف تبدیل بازدیدکننده به سرنخ.",
        en: "Locking brand aesthetic tokens, sitemap hierarchy, technical keyword clusters, and conversion funnel goals.",
      },
    },
    {
      title: { fa: "طراحی وایرفریم‌ها و پروتوتایپ تعاملی", en: "Interactive Prototypes & UX Testing" },
      description: {
        fa: "طراحی صفحات دسکتاپ و موبایل در فیگما و اعتبارسنجی ارگونومی تعاملات پیش از شروع کدنویسی نهایی.",
        en: "Crafting desktop and mobile screens, reviewing edge cases, and validating design with core stakeholders.",
      },
    },
    {
      title: { fa: "پیاده‌سازی فرانت‌اند، سئو و سیستم مدیریت", en: "Component Engineering, SEO & CMS" },
      description: {
        fa: "کدنویسی تمیز با استانداردهای وب مدرن، پیاده‌سازی دارایی‌های برند و اتصال پنل مدیریت با سرعت و امنیت بالا.",
        en: "Engineering performant Server Components, styling semantic tokens, and wiring the admin panel.",
      },
    },
    {
      title: { fa: "تست سرعت، آموزش کاربری و انتشار رسمی", en: "Performance Audits, Training & Go-Live" },
      description: {
        fa: "ارزیابی لایت‌هاوس، آموزش عملی تیم مارکتینگ جهت کار با پنل محتوا و پشتیبانی فنی و مانیتورینگ بدون وقفه.",
        en: "Lighthouse optimization, training marketing teams on CMS workflows, zero-downtime cutover, and continuous monitoring.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "فرانت‌اند و رندرینگ", en: "Frontend & SSR" },
      items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion"],
    },
    {
      label: { fa: "بک‌اند و پایگاه محتوا", en: "Backend & Content Storage" },
      items: ["Node.js", "MongoDB / PostgreSQL", "Redis", "MDX / TipTap Editor"],
    },
    {
      label: { fa: "زیرساخت و امنیت وب", en: "Infra & Edge Security" },
      items: ["Docker", "Nginx / Cloudflare", "Automated CI/CD", "Automated Backups"],
    },
  ],
  systemMap: {
    windowTitle: "kara://web-platform",
    layout: "hub",
    descriptionLead: {
      fa: "سریع‌ترین مسیر اتصال مخاطب به ارزش‌های برند شما.",
      en: "The fastest bridge between your audience and your brand value.",
    },
    description: {
      fa: "رندرینگ آنی سرورساید، سئوی فنی بی‌نقص و اتصال هوشمند فرم‌ها به پایپ‌لاین فروش.",
      en: "Instant server-rendered delivery, technical SEO compliance, and direct lead pipeline ingestion.",
    },
    nodes: {
      inputTop: { fa: "ترافیک گوگل و جست‌وجوی ارگانیک", en: "Organic Search & Google" },
      inputBottom: { fa: "کمپین‌های تبلیغاتی و لینک‌ها", en: "Ad Campaigns & Referrals" },
      core: { fa: "پلتفرم وب Next.js", en: "Next.js Web Platform" },
      outputTop: { fa: "ثبت سرنخ و اتصال به CRM", en: "Lead Ingestion & CRM Sync" },
      outputBottom: { fa: "پنل انتشار محتوا و ادمین", en: "Headless Content Admin" },
    },
    logs: [
      {
        fa: "http.request  path=/services/crm  ttfb=34ms  cache=HIT",
        en: "http.request  path=/services/crm  ttfb=34ms  cache=HIT",
      },
      {
        fa: "lead.captured  form=enterprise_inquiry  status=dispatched",
        en: "lead.captured  form=enterprise_inquiry  status=dispatched",
      },
      {
        fa: "seo.indexed  sitemap=updated  canonical=valid",
        en: "seo.indexed  sitemap=updated  canonical=valid",
      },
    ],
  },
  faqs: [
    {
      id: "web-vs-wordpress",
      question: {
        fa: "چرا به جای وردپرس، پلتفرم اختصاصی با Next.js را پیشنهاد می‌کنید؟",
        en: "Why choose a custom Next.js platform over WordPress?",
      },
      answer: {
        fa: "وردپرس برای وبلاگ‌های ساده مناسب است، اما با اضافه شدن افزونه‌های متعدد، به شدت کند، ناامن و پرهزینه برای نگهداری می‌شود. پلتفرم اختصاصی Next.js زمان لود زیر ۱ ثانیه دارد، از نظر امنیتی در برابر حملات متداول نفوذناپذیر است و در صفحات با ترافیک بالا هرگز با افت سرعت مواجه نمی‌شود.",
        en: "WordPress becomes sluggish, fragile, and insecure as plugins accumulate. A custom Next.js architecture delivers sub-second load times, impregnable security surfaces, and rock-solid performance under peak traffic.",
      },
    },
    {
      id: "web-seo-rankings",
      question: {
        fa: "آیا معماری این وب‌سایت‌ها از نظر گوگل و سئو کاملاً بهینه است؟",
        en: "Is the architecture fully optimized for Google indexing and technical SEO?",
      },
      answer: {
        fa: "بله، به کارگیری رندرینگ سمت سرور (SSR)، ساختار داده‌های اسکیما (Schema.org)، رعایت استانداردهای Core Web Vitals و بهینه‌سازی خودکار تصاویر، بهترین بستر فنی ممکن را برای صعود در نتایج گوگل فراهم می‌آورد.",
        en: "Yes. Leveraging Server-Side Rendering (SSR), structured JSON-LD schemas, perfect Core Web Vitals scores, and modern asset optimizations ensures the highest possible technical foundation for Google rankings.",
      },
    },
    {
      id: "web-content-editing",
      question: {
        fa: "آیا تیم مارکتینگ ما می‌تواند بدون نیاز به برنامه‌نویس، محتوا منتشر کند؟",
        en: "Can our marketing team publish content without developer intervention?",
      },
      answer: {
        fa: "کاملاً؛ همراه با وب‌سایت یک پنل مدیریت محتوای فارسی، مدرن و سبک تحویل داده می‌شود که به کارشناسان محتوای شما اجازه می‌دهد صفحات، مقالات، خدمات و تصاویر را با یک ویرایشگر بصری منتشر و ویرایش کنند.",
        en: "Completely. We provide an intuitive, modern editorial admin dashboard enabling your marketing team to draft, format, and publish articles, services, and media with zero coding required.",
      },
    },
    {
      id: "web-timeline",
      question: {
        fa: "طراحی و توسعه پلتفرم وب سازمانی چقدر زمان نیاز دارد؟",
        en: "How long does building an enterprise web platform take?",
      },
      answer: {
        fa: "پروژه‌های استاندارد وب‌سایت سازمانی معمولاً بین ۴ تا ۸ هفته از فاز طراحی تا رونمایی نهایی زمان می‌برند و در طول این مدت، مراحل پیشرفت کار در جلسات منظم به کارفرما گزارش داده می‌شود.",
        en: "A standard corporate web platform typically takes 4 to 8 weeks from initial design tokens to live deployment, with structured weekly demos and stakeholder milestone approvals.",
      },
    },
  ],
  relatedProjects: ["ops-crm-pilot", "rag-boundaries"],
  bento: {
    order: 4,
    span: 2,
    image: "/brand/bento/web-platforms.svg",
    shortTitle: {
        fa: "وب‌سایت و پلتفرم",
        en: "Websites and platforms"
    }
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">سرعت لود وب‌سایت = نرخ تبدیل و درآمد بیشتر</p>
      <p class="text-sm text-muted m-0 leading-relaxed">بر اساس مطالعات رفتارشناسی وب، هر یک ثانیه تاخیر در باز شدن صفحه وب‌سایت، تا ۲۰٪ نرخ تبدیل بازدیدکنندگان به مشتری را کاهش می‌دهد. وب‌سایت‌های مهندسی‌شده با Next.js در کارا پرداز اوند، تصویری مدرن، باوقار و فوق‌سریع از برند شما به نمایش می‌گذارند.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">سه برتری تکنولوژی مدرن وب در برابر قالب‌های آماده</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. سرعت لود زیر یک ثانیه (TTFB)</p>
        <p class="text-sm text-muted leading-relaxed m-0">بهره‌گیری از Server Components و بهینه‌سازی اتوماتیک تصاویر و فونت‌ها، صفحات را حتی روی ضعیف‌ترین اینترنت‌های همراه در یک چشم‌به‌هم‌زدن باز می‌کند.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. امنیت پولادین و بدون باگ افزونه‌ها</p>
        <p class="text-sm text-muted leading-relaxed m-0">حذف معماری شکننده افزونه‌های سنتی؛ کدهای بهینه‌شده و تست‌شده مانع از نفوذ بدافزارها و قطعی‌های ناگهانی وب‌سایت می‌شوند.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. تجربه کاربری روان در کلاس جهانی</p>
        <p class="text-sm text-muted leading-relaxed m-0">طراحی متناسب با هویت برند، انیمیشن‌های باوقار، تایپوگرافی چشم‌نواز و دسترسی‌پذیری کامل در دسکتاپ و تمامی مدل‌های موبایل.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">جلسه ارزیابی هویت وب و استراتژی رشد</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در یک گفتگوی مشاوره فنی، نقاط ضعف عملکرد فعلی، پتانسیل‌های سئو و نقشه راه حضور مقتدرانه آنلاین سازمان خود را با ما بررسی کنید.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست مشاوره و استعلام پروژه وب‌سایت" data-cta-url="/contact?service=web-platforms" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=web-platforms" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست مشاوره و استعلام پروژه وب‌سایت</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
