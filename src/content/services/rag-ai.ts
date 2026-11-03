import type { Service } from "@/lib/content";

export const ragAiService = {
  slug: "rag-ai",
  title: {
    fa: "RAG و هوش مصنوعی سازمانی",
    en: "RAG and enterprise AI",
  },
  outcome: {
    fa: "پاسخ دقیق از دانش داخلی سازمان با کنترل دسترسی و قابلیت ردیابی.",
    en: "Grounded answers from internal knowledge with access control and traceability.",
  },
  audience: [
    {
      fa: "سازمان‌هایی که دانش در اسناد پراکنده است و جست‌وجوی دستی کند است.",
      en: "Organizations whose knowledge is scattered in documents and manual search is slow.",
    },
    {
      fa: "تیم‌هایی که به دستیار پاسخ‌گو با ذکر منبع نیاز دارند، نه تولید آزاد.",
      en: "Teams that need a grounded assistant with citations—not free-form generation.",
    },
    {
      fa: "واحدهای فناوری که کنترل دسترسی و لاگ تصمیم برایشان حیاتی است.",
      en: "Technology units for whom access control and decision logging are critical.",
    },
  ],
  deliverables: [
    {
      title: {
        fa: "ایندکس امن اسناد",
        en: "Secure document indexing",
      },
      description: {
        fa: "قطعه‌بندی، متادیتا و مرز دسترسی روی منابع داخلی.",
        en: "Chunking, metadata, and access boundaries on internal sources.",
      },
    },
    {
      title: {
        fa: "خط لوله بازیابی و پاسخ",
        en: "Retrieval and answer pipeline",
      },
      description: {
        fa: "جست‌وجوی برداری، بازرتبه‌بندی و تولید پاسخ با منبع.",
        en: "Vector search, reranking, and answer generation with sources.",
      },
    },
    {
      title: {
        fa: "رابط پرسش برای نقش‌ها",
        en: "Role-aware ask interface",
      },
      description: {
        fa: "تجربهٔ گفتگو با محدودیت دسترسی هر نقش.",
        en: "A chat experience constrained by each role's access.",
      },
    },
    {
      title: {
        fa: "ارزیابی کیفیت",
        en: "Quality evaluation",
      },
      description: {
        fa: "مجموعهٔ پرسش‌های مرجع، معیار صحت و رگرسیون پاسخ.",
        en: "Reference questions, correctness metrics, and answer regression checks.",
      },
    },
    {
      title: {
        fa: "لاگ تصمیم و ممیزی",
        en: "Decision log and audit",
      },
      description: {
        fa: "ثبت پرسش، منابع استفاده‌شده و نتیجه برای بازبینی بعدی.",
        en: "Logging queries, sources used, and outcomes for later review.",
      },
      needs_business_confirmation: true,
    },
  ],
  steps: [
    {
      title: { fa: "منابع و دسترسی", en: "Sources and access" },
      description: {
        fa: "اسناد مجاز، مالکان داده و سطوح محرمانگی را مشخص می‌کنیم.",
        en: "We define allowed documents, data owners, and confidentiality levels.",
      },
    },
    {
      title: { fa: "ایندکس و بازیابی", en: "Index and retrieval" },
      description: {
        fa: "خط لولهٔ ایندکس و کیفیت بازیابی را روی مجموعهٔ آزمایشی می‌سنجیم.",
        en: "We build the index pipeline and measure retrieval quality on a test set.",
      },
    },
    {
      title: { fa: "پاسخ و ارزیابی", en: "Answers and evaluation" },
      description: {
        fa: "تولید پاسخ با منبع، harness ارزیابی و آستانهٔ قبول را تنظیم می‌کنیم.",
        en: "We tune grounded answers, an evaluation harness, and acceptance thresholds.",
      },
    },
    {
      title: { fa: "استقرار کنترل‌شده", en: "Controlled rollout" },
      description: {
        fa: "انتشار برای گروه محدود، پایش خطا و گسترش تدریجی.",
        en: "Limited-group launch, error monitoring, and gradual expansion.",
      },
      needs_business_confirmation: true,
    },
  ],
  stack: [
    {
      label: { fa: "هوش مصنوعی", en: "AI" },
      items: ["Python", "Vector store", "LLM API"],
    },
    {
      label: { fa: "محصول", en: "Product" },
      items: ["TypeScript UI", "Auth / RBAC", "Eval harness"],
    },
  ],
  systemMap: {
    windowTitle: "kara://rag-ai",
    layout: "pipeline",
    descriptionLead: {
      fa: "دستیار هوشمند روی دانش سازمان.",
      en: "A smart assistant on your organization knowledge.",
    },
    description: {
      fa: "پاسخ‌ها با ذکر منبع.",
      en: "Answers with citations.",
    },
    nodes: {
      inputTop: { fa: "اسناد و دانش", en: "Docs & knowledge" },
      inputBottom: { fa: "پرسش کاربر", en: "User query" },
      core: { fa: "RAG", en: "RAG" },
      outputTop: { fa: "پاسخ با منبع", en: "Answer with source" },
      outputBottom: { fa: "کیفیت پاسخ‌ها", en: "Answer quality" },
    },
    logs: [
      { fa: "docs.indexed  chunks=2,480", en: "docs.indexed  chunks=2,480" },
      { fa: "query.received  lang=fa", en: "query.received  lang=fa" },
      { fa: "answer.sent  sources=3", en: "answer.sent  sources=3" },
    ],
  },
  faqs: [
    {
      id: "rag-hallucination",
      question: {
        fa: "چطور جلوی پاسخ‌های ساختگی گرفته می‌شود؟",
        en: "How do you reduce fabricated answers?",
      },
      answer: {
        fa: "با بازیابی محدود به منابع مجاز، اجبار به ذکر منبع، و ارزیابی روی مجموعهٔ پرسش‌های مرجع. حذف کامل خطا تضمین نمی‌شود؛ هدف کاهش و ردیابی است.",
        en: "By retrieving only allowed sources, requiring citations, and evaluating against reference questions. Zero error is not guaranteed—the goal is reduction and traceability.",
      },
    },
    {
      id: "rag-data",
      question: {
        fa: "داده‌ها کجا پردازش می‌شوند؟",
        en: "Where is data processed?",
      },
      answer: {
        fa: "بسته به توافق؛ می‌توان روی زیرساخت شما یا ارائه‌دهندهٔ تأییدشده اجرا کرد. جزئیات در دامنهٔ پروژه قفل می‌شود.",
        en: "By agreement—on your infrastructure or an approved provider. Details are locked in project scope.",
      },
      needs_business_confirmation: true,
    },
    {
      id: "rag-languages",
      question: {
        fa: "پشتیبانی از فارسی چگونه است؟",
        en: "How is Persian supported?",
      },
      answer: {
        fa: "ایندکس و رابط برای فارسی طراحی می‌شود؛ کیفیت به مدل، پیش‌پردازش و کیفیت اسناد بستگی دارد.",
        en: "Indexing and UI are designed for Persian; quality depends on the model, preprocessing, and document quality.",
      },
    },
    {
      id: "rag-cost",
      question: {
        fa: "هزینهٔ اجرای مدل‌ها چگونه مدیریت می‌شود؟",
        en: "How are model running costs managed?",
      },
      answer: {
        fa: "با محدودیت نرخ، کش پاسخ‌های تکراری و انتخاب مدل متناسب با سطح حساسیت. سقف هزینه در قرارداد قابل تعریف است.",
        en: "With rate limits, caching repeated answers, and model choice by sensitivity. Cost caps can be defined in the contract.",
      },
      needs_business_confirmation: true,
    },
  ],
  relatedProjects: ["rag-knowledge-pilot"],
  bento: {
    order: 1,
    span: 2,
    image: "/brand/bento/rag-ai.svg",
    shortTitle: {
      fa: "RAG و هوش مصنوعی",
      en: "RAG and AI",
    },
  },
  needs_business_confirmation: true,
} as const satisfies Service;
