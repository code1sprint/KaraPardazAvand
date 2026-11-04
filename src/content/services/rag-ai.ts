import type { Service } from "@/lib/content";

export const ragAiService = {
  slug: "rag-ai",
  title: {
    fa: "RAG و هوش مصنوعی سازمانی",
    en: "RAG and enterprise AI",
  },
  outcome: {
    fa: "هوش مصنوعی مستند به دانش سازمانی (RAG)؛ دسترسی آنی به پاسخ‌های دقیق، مستند و محرمانه از میان هزاران سند داخلی، بدون خطای توهم و با کنترل دسترسی پیشرفته.",
    en: "Enterprise Grounded RAG & AI; instant, verifiable answers extracted from internal organizational documents with zero hallucinations, strict access controls, and full source citation.",
  },
  audience: [
    {
      fa: "سازمان‌ها و نهادهایی که حجم انبوهی از آیین‌نامه‌ها، دستورالعمل‌های فنی، قراردادها یا پرونده‌ها دارند و بازیابی دستی آن‌ها روزانه ساعت‌ها زمان پرسنل را تلف می‌کند.",
      en: "Enterprises with extensive repositories of policies, technical manuals, contracts, or case files where manual search wastes hours daily.",
    },
    {
      fa: "تیم‌های پشتیبانی مشتریان و عملیات فنی که به پاسخ‌های فوری، مستند و استاندارد نیاز دارند و نمی‌توانند ریسک پاسخ‌های نادرست چت‌بات‌های عمومی را بپذیرند.",
      en: "Support and technical teams requiring instant, grounded, standard responses who cannot afford the hallucinations of public generic chatbots.",
    },
    {
      fa: "مدیران ارشد فناوری (CTO) و امنیت که نیازمند استقرار هوش مصنوعی درون زیرساخت‌های خصوصی سازمان (On-Premise یا Dedicated Cloud) با تفکیک دقیق دسترسی‌ها هستند.",
      en: "CTOs and CISOs requiring on-premise or isolated cloud AI deployment with fine-grained role-based document access controls.",
    },
    {
      fa: "شرکت‌هایی که می‌خواهند دانش انباشته کارشناسان ارشد و آرشیو تجربیات شرکت را به یک دستیار هوشمند و همیشه در دسترس برای آموزش و راهنمایی پرسنل جدید تبدیل کنند.",
      en: "Organizations aiming to transform senior institutional knowledge and historical archives into an always-available interactive assistant.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "خط لوله پالایش، قطعه‌بندی و ایندکس برداری امن",
        en: "Secure Chunking & Vector Indexing Pipeline",
      },
      description: {
        fa: "تبدیل فایل‌های PDF، ورد، پایگاه‌های داده و ویکی‌های داخلی به بردار‌های معنایی با برچسب‌گذاری دقیق متادیتا و سطوح محرمانگی.",
        en: "Transforming PDFs, documents, databases, and wikis into semantic vector embeddings with strict metadata and confidentiality tags.",
      },
    },
    {
      title: {
        fa: "موتور بازیابی ترکیبی و بازرتبه‌بندی پیشرفته (Hybrid Search & Reranking)",
        en: "Hybrid Search & Neural Reranking",
      },
      description: {
        fa: "ترکیب جست‌وجوی کلمات کلیدی (BM25) و جست‌وجوی معنایی همراه با مدل‌های Reranker برای استخراج مرتبط‌ترین قطعات مستندات.",
        en: "Fusing lexical BM25 and dense semantic search with cross-encoder rerankers to surface exact context chunks.",
      },
    },
    {
      title: {
        fa: "تولید پاسخ مستند به شواهد با ذکر دقیق منبع (Grounded Generation)",
        en: "Grounded Generation with Inline Citations",
      },
      description: {
        fa: "پاسخ‌دهی مدل بر اساس تنها متون بازیابی‌شده، با درج شماره صفحه، لینک به پاراگراف اصلی و صفر کردن خطای توهم هوش مصنوعی.",
        en: "Constraining LLMs strictly to retrieved evidence with deep links and exact page/paragraph citations, eliminating hallucinations.",
      },
    },
    {
      title: {
        fa: "کنترل دسترسی نقش‌محور سازمانی (RBAC for AI)",
        en: "Role-Based Access Control for AI",
      },
      description: {
        fa: "پرسنل تنها پاسخ‌هایی را دریافت می‌کنند که به اسناد منبع آن دسترسی مجاز دارند؛ تفکیک کامل دسترسی مدیریت، فنی و اداری.",
        en: "Users only receive answers derived from documents their specific security clearance permits to view.",
      },
    },
    {
      title: {
        fa: "سامانه ارزیابی کیفیت پاسخ‌ها و فریم‌ورک بنچمارک (Eval Harness)",
        en: "Evaluation Harness & Continuous Benchmarking",
      },
      description: {
        fa: "تست خودکار و پایش پیوسته صحت، ارتباط معنایی و وفاداری پاسخ‌ها به اسناد با معیارهای استاندارد صنعتی نظیر Ragas.",
        en: "Automated regression testing tracking faithfulness, relevance, and semantic precision against standard evaluation metrics.",
      },
      needs_business_confirmation: true,
    },
    {
      title: {
        fa: "رابط کاربری چت سازمانی و لاگ کامل تصمیمات (Audit Trail)",
        en: "Enterprise Chat Interface & Audit Logs",
      },
      description: {
        fa: "رابط کاربری مدرن با امکان جست‌وجوی پیشرفته، همراه با ثبت تاریخچه کامل سوالات، متون مبنا و پاسخ‌ها برای ممیزی حراست و مدیریت.",
        en: "Clean chat interface and compliance dashboard capturing every prompt, retrieved context, and generated response.",
      },
    },
  ],
  steps: [
    {
      title: { fa: "ممیزی اسناد و تعریف ماتریس محرمانگی", en: "Data Audit & Security Matrix" },
      description: {
        fa: "بررسی فرمت اسناد، پاکسازی نویزهای متنی و تعیین دقیق مرزهای دسترسی هر گروه از کاربران به منابع.",
        en: "Auditing knowledge formats, cleaning document noise, and drafting access boundaries across teams.",
      },
    },
    {
      title: { fa: "معماری خط لوله و بهینه‌سازی بازیابی", en: "Pipeline Architecture & Retrieval Tuning" },
      description: {
        fa: "انتخاب مدل Embedding بهینه برای زبان فارسی و تخصصی، پیکربندی Vector DB و تنظیم استراتژی قطعه‌بندی اسناد.",
        en: "Selecting optimized Persian embeddings, configuring Vector DB schemas, and fine-tuning chunking strategies.",
      },
    },
    {
      title: { fa: "توسعه پروتکل استناد و ارزیابی کیفیت", en: "Citation Grounding & Quality Evaluation" },
      description: {
        fa: "تنظیم پرامپت‌های مهندسی‌شده، جلوگیری از توهم و سنجش خروجی روی صدها پرسش واقعی سازمانی.",
        en: "Crafting defensive prompt architectures, running benchmark test suites, and tuning threshold scores.",
      },
    },
    {
      title: { fa: "استقرار در زیرساخت خصوصی و آموزش پرسنل", en: "On-Prem / Private Cloud Deploy & Handoff" },
      description: {
        fa: "راه‌اندازی ایزوله درون سرورهای سازمان، اتصال به سامانه‌های احراز هویت داخلی (SSO) و برگزاری کارگاه کاربری.",
        en: "Deploying within isolated infrastructure, integrating enterprise SSO, and holding hands-on operational workshops.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "پایگاه داده برداری و بازیابی", en: "Vector DB & Search" },
      items: ["Qdrant", "pgvector", "BM25 Hybrid", "Cross-Encoder Rerankers"],
    },
    {
      label: { fa: "فریم‌ورک‌های AI و پایپ‌لاین", en: "AI Frameworks & Pipeline" },
      items: ["LangChain", "LlamaIndex", "Python FastAPIs", "Ragas Eval"],
    },
    {
      label: { fa: "مدل‌ها و استقرار", en: "Models & Deployment" },
      items: ["Local LLMs (Ollama / vLLM)", "OpenAI / Claude APIs", "Docker", "GPU Clusters"],
    },
  ],
  systemMap: {
    windowTitle: "kara://rag-pipeline",
    layout: "pipeline",
    descriptionLead: {
      fa: "بازیابی مستندات و تولید پاسخ با استناد به منبع.",
      en: "Document retrieval and answer generation with grounded citations.",
    },
    description: {
      fa: "جست‌وجوی برداری در پایگاه دانش سازمانی، پالایش نتایج و استخراج پاسخ بدون خطای توهم.",
      en: "Vector search over private knowledge bases, context reranking, and zero-hallucination synthesis.",
    },
    nodes: {
      inputTop: { fa: "اسناد و مخازن داده", en: "Documents & Data Warehouses" },
      inputBottom: { fa: "پرسش کاربر و سطح دسترسی", en: "User Query & RBAC Scope" },
      core: { fa: "موتور بازیابی و RAG", en: "RAG Retrieval Core" },
      outputTop: { fa: "پاسخ با استناد و لینک صفحه", en: "Answer with Inline Citations" },
      outputBottom: { fa: "لاگ ممیزی و ارزیابی کیفیت", en: "Audit Logs & Eval Metrics" },
    },
    logs: [
      {
        fa: "doc.ingested  file=hr_policy_2026.pdf  chunks=42  status=embedded",
        en: "doc.ingested  file=hr_policy_2026.pdf  chunks=42  status=embedded",
      },
      {
        fa: "query.retrieved  query_hash=9a8f2  top_k=3  rerank_score=0.94",
        en: "query.retrieved  query_hash=9a8f2  top_k=3  rerank_score=0.94",
      },
      {
        fa: "response.generated  citations=[chunk_12,chunk_18]  faithfulness=0.99",
        en: "response.generated  citations=[chunk_12,chunk_18]  faithfulness=0.99",
      },
    ],
  },
  faqs: [
    {
      id: "rag-vs-chatgpt",
      question: {
        fa: "تفاوت سیستم RAG اختصاصی با چت‌بات‌های عمومی مثل ChatGPT چیست؟",
        en: "What is the difference between custom enterprise RAG and public tools like ChatGPT?",
      },
      answer: {
        fa: "چت‌بات‌های عمومی از دانش اختصاصی و محرمانه سازمان شما بی‌خبرند و در پاسخ به سوالات تخصصی به آسانی دچار توهم و اشتباه می‌شوند. سیستم RAG منحصراً بر اساس متون اسناد بارگذاری‌شده سازمان شما پاسخ تولید می‌کند، برای تک‌تک جملات مرجع دقیق (صفحه و پاراگراف) ارائه می‌دهد و داده‌های محرمانه سازمان را هرگز به بیرون نشت نمی‌دهد.",
        en: "Public models lack access to proprietary enterprise data and frequently hallucinate answers. A custom RAG system synthesizes responses strictly from your internal repositories, provides exact page citations, and guarantees complete data privacy.",
      },
    },
    {
      id: "rag-security-privacy",
      question: {
        fa: "آیا اسناد و اطلاعات محرمانه ما به سرورهای خارجی ارسال می‌شود؟",
        en: "Are our confidential corporate documents sent to external third-party servers?",
      },
      answer: {
        fa: "خیر؛ ما امکان پیاده‌سازی ۱۰۰٪ محلی (On-Premise) را با استفاده از مدل‌های منبع‌باز قدرتمند روی سرورهای سخت‌افزاری اختصاصی خود سازمان شما فراهم می‌کنیم؛ به‌گونه‌ای که هیچ بایت داده‌ای از شبکه داخلی شرکت خارج نمی‌شود.",
        en: "Not necessarily. We deploy fully localized (On-Premise) setups utilizing high-performance open-weight LLMs on your own private infrastructure, guaranteeing zero data leaves your local network.",
      },
    },
    {
      id: "rag-formats-scale",
      question: {
        fa: "سامانه چه فرمت‌هایی از اسناد را پشتیبانی می‌کند و سقف حجم داده چقدر است؟",
        en: "What document formats are supported and what is the data scale ceiling?",
      },
      answer: {
        fa: "کلیه فرمت‌های متنی از جمله PDF، اسناد Word، اکسل، صفحات وب، پایگاه‌های داده و حتی رونوشت مکالمات صوتی پشتیبانی می‌شوند. با معماری مقیاس‌پذیر دیتابیس‌های برداری، جست‌وجو در میلیون‌ها صفحه با زمان پاسخ کمتر از یک ثانیه انجام می‌گیرد.",
        en: "All enterprise formats including PDF, Word, Excel, raw databases, and audio transcripts are supported. Vector index architectures maintain sub-second queries across millions of pages.",
      },
    },
    {
      id: "rag-persian-quality",
      question: {
        fa: "دقت سامانه در درک اصطلاحات تخصصی و زبان فارسی به چه میزان است؟",
        en: "How accurate is the system with Persian language nuances and domain jargon?",
      },
      answer: {
        fa: "ما از مدل‌های برداری و بازرتبه‌بندی اختصاصی بهینه‌شده برای زبان فارسی استفاده می‌کنیم. همچنین با اعمال گام‌های نرمال‌سازی متن و تنظیم تخصصی برای واژگان صنعت شما، بالاترین سطح دقت معنایی تضمین می‌شود.",
        en: "We deploy specialized Persian-tuned embedding and reranking models, combined with sophisticated text normalization to guarantee superior semantic comprehension of domain-specific jargon.",
      },
    },
  ],
  relatedProjects: ["rag-boundaries", "telecom-bi-platform"],
  bento: {
    order: 1,
    span: 2,
    image: "/brand/bento/rag-ai.svg",
    shortTitle: {
        fa: "RAG و هوش مصنوعی",
        en: "RAG and AI"
    }
  },
  deepDiveHtml: `<div data-callout-type="note" class="callout callout-note rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">پایان عصر جست‌وجوهای کلافه‌کننده در آرشیو اسناد</p>
      <p class="text-sm text-muted m-0 leading-relaxed">در سازمان‌های سنتی، کارشناسان هر روز ساعت‌ها وقت خود را صرف یافتن یک بخشنامه، تبصره حقوقی یا دستورالعمل فنی می‌کنند. معماری RAG اختصاصی کارا پرداز اوند این زمان را به چند ثانیه کاهش داده و ریسک تفسیر اشتباه قوانین را به صفر می‌رساند.</p>
    </div>

    <h3 class="text-xl font-bold text-text mt-8 mb-4">ارکان تضمین کیفیت در سامانه‌های RAG سازمانی</h3>
    
    <div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6" data-card-grid="" data-columns="3">
      
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۱. استناد قطعی و عدم توهم (No Hallucination)</p>
        <p class="text-sm text-muted leading-relaxed m-0">مدل ملزم به پاسخ‌گویی منحصراً بر اساس فکت‌های استخراج‌شده است و برای هر ادعا لینک مستقیم به متن و صفحه سند پیوست می‌شود.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۲. امنیت و حریم خصوصی On-Premise</p>
        <p class="text-sm text-muted leading-relaxed m-0">امکان استقرار بر بستر سرورهای داخلی سازمان با کارت‌های گرافیک اختصاصی، بدون نیاز به اینترنت و بدون خروج اطلاعات محرمانه.</p>
      </div>
      <div class="rounded-2xl border border-line bg-panel p-6 shadow-sm" data-card-item="">
        <p class="font-bold text-text mb-2 text-base text-blue">۳. هماهنگی کامل با ماتریس دسترسی پرسنل</p>
        <p class="text-sm text-muted leading-relaxed m-0">مدیر مالی اسناد محرمانه را در پاسخ‌ها می‌بیند، اما کارشناس عادی تنها به دستورالعمل‌های عمومی بخش خود دسترسی خواهد داشت.</p>
      </div>
    </div>

    <div data-callout-type="warning" class="callout callout-warning rounded-2xl border p-4 my-4 leading-relaxed">
      <p class="font-bold text-text mb-1">دمو عملیاتی روی نمونه اسناد شما</p>
      <p class="text-sm text-muted m-0 leading-relaxed">یک نمونه از اسناد عمومی سازمان خود را ارسال کنید تا در یک جلسه زنده، سرعت و دقت پاسخ‌گویی موتور هوش مصنوعی ما را مشاهده فرمایید.</p>
    </div>

    <div data-inline-cta="" data-cta-label="درخواست جلسه دمو و بررسی فنی RAG" data-cta-url="/contact?service=rag-ai" data-cta-variant="primary" data-cta-align="center">
      <a href="/contact?service=rag-ai" data-cta-variant="primary" class="cta-btn cta-btn-primary inline-flex items-center gap-2 rounded-2xl bg-blue text-on-brand px-6 py-3.5 font-bold text-sm shadow hover:bg-navy-2 transition-all not-prose no-underline">
        <span class="text-on-brand">درخواست جلسه دمو و بررسی فنی RAG</span>
        <span class="text-orange text-xs">◀</span>
      </a>
    </div>`,
} as const satisfies Service;
