import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getSiteSettingsModel } from "../src/lib/db/models/SiteSettings";

async function seed() {
  console.log("Seeding Site & Home settings into MongoDB...");
  await connectToDatabase();
  const SiteSettings = await getSiteSettingsModel();

  const existing = await SiteSettings.findOne();
  if (existing) {
    console.log("SiteSettings already exist, skipping create.");
    process.exit(0);
  }

  await SiteSettings.create({
    hero: {
      pill: {
        fa: "از خانواده Code1Sprint",
        en: "From the Code1Sprint family",
      },
      titleBefore: {
        fa: "سیستم‌هایی که ",
        en: "Systems that move ",
      },
      titleGradient: {
        fa: "کار سازمان شما",
        en: "your organization's work",
      },
      titleAfter: {
        fa: " را جلو می‌برند",
        en: " forward",
      },
      lead: {
        fa: "طراحی و توسعه نرم‌افزار سفارشی، CRM، ERP، هوش مصنوعی سازمانی و داشبورد داده؛ از تحلیل نیاز تا پشتیبانی بعد از تحویل.",
        en: "Custom software design and development, CRM, ERP, enterprise AI, and data dashboards—from needs analysis through post-delivery support.",
      },
      ctaPrimary: {
        label: {
          fa: "درخواست مشاوره رایگان",
          en: "Request a free consultation",
        },
        href: "/contact",
      },
      ctaSecondary: {
        label: {
          fa: "مشاهده خدمات",
          en: "View services",
        },
        href: "/services",
      },
      techMarquee: [
        "TypeScript",
        "PostgreSQL",
        "Python",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Docker",
        "Redis",
        "FastAPI",
        "Node.js",
      ],
    },
    whyStatements: [
      {
        id: "staged-delivery",
        title: {
          fa: "تحویل مرحله‌ای",
          en: "Staged delivery",
        },
        body: {
          fa: "کار را در گام‌های قابل بررسی پیش می‌بریم تا اولویت‌ها زود دیده شوند.",
          en: "We move in reviewable stages so priorities surface early.",
        },
      },
      {
        id: "code-ownership",
        title: {
          fa: "مالکیت کامل کد",
          en: "Full code ownership",
        },
        body: {
          fa: "کد، مستندات و دسترسی‌ها در اختیار شماست؛ بدون قفل فروشنده.",
          en: "Code, docs, and access stay with you—no vendor lock-in.",
        },
      },
      {
        id: "post-launch-support",
        title: {
          fa: "پشتیبانی پس از انتشار",
          en: "Post-launch support",
        },
        body: {
          fa: "بعد از انتشار برای پایداری، رفع اشکال و بهبودهای کوتاه‌مدت کنار شما می‌مانیم.",
          en: "After launch we stay for stability, fixes, and short-cycle improvements.",
        },
      },
    ],
    stats: [
      {
        id: "projects",
        value: "",
        label: {
          fa: "سامانه‌ها و پلتفرم‌های عملیاتی تحویل‌شده",
          en: "Delivered operational systems and platforms",
        },
        source: "",
      },
      {
        id: "years",
        value: "",
        label: {
          fa: "سال تجربهٔ تجمیعی در مهندسی نرم‌افزار سازمانی",
          en: "Years cumulative enterprise engineering experience",
        },
        source: "",
      },
      {
        id: "industries",
        value: "",
        label: {
          fa: "صنعت و حوزهٔ کسب‌وکار تحت پوشش",
          en: "Covered industries and verticals",
        },
        source: "",
      },
    ],
    contact: {
      phone: "",
      email: "info@karapardaz.com",
      address: {
        fa: "تهران، میدان ونک، خیابان ملاصدرا",
        en: "Tehran, Mollasadra St.",
      },
      workingHours: {
        fa: "شنبه تا چهارشنبه ۹:۰۰ الی ۱۸:۰۰",
        en: "Saturday to Wednesday 9:00 - 18:00",
      },
      socials: {
        linkedin: "https://linkedin.com/company/karapardaz",
        github: "https://github.com/karapardaz",
        telegram: "https://t.me/karapardaz",
        instagram: "",
      },
    },
    seo: {
      siteName: {
        fa: "کارا پرداز اوند",
        en: "Kara Pardaz Oond",
      },
      homeTitle: {
        fa: "کارا پرداز اوند | توسعه نرم‌افزار و سامانه‌های سازمانی",
        en: "Kara Pardaz Oond | Enterprise Software & Platform Development",
      },
      homeDescription: {
        fa: "طراحی و توسعه نرم‌افزار سفارشی، وب‌سایت، CRM، ERP، هوش مصنوعی سازمانی و داشبورد داده برای کسب‌وکارها و سازمان‌ها.",
        en: "Custom software design, enterprise CRM, ERP, RAG & data dashboards for modern businesses.",
      },
      ogImageAlt: {
        fa: "تصویر اشتراک‌گذاری کارا پرداز اوند",
        en: "Kara Pardaz Oond preview card",
      },
    },
  });

  console.log("SiteSettings seeded successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
