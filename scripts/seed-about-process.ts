import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { getAboutModel } from "../src/lib/db/models/About";
import { getProcessModel } from "../src/lib/db/models/Process";

async function seed() {
  console.log("Seeding About and Process data into MongoDB...");
  await connectToDatabase();

  const About = await getAboutModel();
  const Process = await getProcessModel();

  // 1. Seed About
  const existingAbout = await About.findOne();
  if (!existingAbout) {
    console.log("Creating default About document...");
    await About.create({
      intro: {
        title: {
          fa: "نرم‌افزاری می‌سازیم که با کار واقعی سازمان هم‌خوان باشد",
          en: "We build software that fits how organizations actually work",
        },
        lead: {
          fa: "کارا پرداز اوند سامانه‌های سفارشی، وب، CRM، ERP، RAG و داشبورد داده را با تمرکز بر نتیجهٔ عملیاتی طراحی و تحویل می‌دهد.",
          en: "Kara Pardaz Oond designs and delivers custom systems, web, CRM, ERP, RAG, and data dashboards—focused on operational outcomes.",
        },
      },
      story: {
        title: {
          fa: "داستان کارا پرداز اوند",
          en: "The Story of Kara Pardaz Oond",
        },
        tiptapBody: {
          fa: {
            html: "<p>کارا پرداز اوند با هدف تحویل نرم‌افزارهای سازمانی دقیق، قابل نگهداری و هماهنگ با فرایندهای واقعی کسب‌وکارهای ایرانی شکل گرفته است. ما باور داریم توسعه نرم‌افزار سازمانی نباید متکی بر وعده‌های توخالی یا سیستم‌های پیچیده غیرکاربردی باشد؛ بلکه هر خط کد و هر ماژول باید یک گره عملیاتی واقعی از سازمان را باز کند.</p>",
            json: null,
          },
          en: {
            html: "<p>Kara Pardaz Oond was founded to deliver precise, maintainable enterprise software aligned with real-world business workflows. We believe enterprise software should never rely on empty promises or bloated systems; every line of code must unlock measurable operational value.</p>",
            json: null,
          },
        },
      },
      principles: [
        {
          id: "clarity",
          title: {
            fa: "شفافیت از روز اول",
            en: "Clarity from day one",
          },
          body: {
            fa: "محدوده، فرضیات و معیار موفقیت را پیش از ساخت می‌نویسیم تا مسیر قابل بررسی بماند.",
            en: "We write scope, assumptions, and success criteria before building so the path stays reviewable.",
          },
        },
        {
          id: "fit",
          title: {
            fa: "هم‌خوانی با فرایند واقعی",
            en: "Fit to real process",
          },
          body: {
            fa: "سیستم را با کار روزمرهٔ تیم شما هم‌راستا می‌کنیم؛ نه با قالب‌های کلی و ادعای همه‌کاره.",
            en: "We align the system with how your team actually works—not one-size-fits-all templates.",
          },
        },
        {
          id: "ownership",
          title: {
            fa: "تحویل قابل نگهداری",
            en: "Maintainable delivery",
          },
          body: {
            fa: "کد، مستندات و دسترسی‌ها طوری تحویل می‌شوند که تیم شما بتواند ادامه دهد.",
            en: "Code, docs, and access are handed over so your team can keep going.",
          },
        },
        {
          id: "evidence",
          title: {
            fa: "ادعا فقط با شواهد",
            en: "Claims only with evidence",
          },
          body: {
            fa: "آمار، نام مشتری و تعهد قراردادی را فقط وقتی منتشر می‌کنیم که تأیید شده باشد.",
            en: "We publish stats, client names, and contractual claims only when confirmed.",
          },
        },
      ],
      brandNodes: [
        {
          id: "code1sprint",
          name: {
            fa: "Code1Sprint",
            en: "Code1Sprint",
          },
          focus: {
            fa: "برند مادر؛ مسیر محصول و مهندسی در خانوادهٔ برند",
            en: "Parent brand; product and engineering direction across the family",
          },
        },
        {
          id: "kara",
          name: {
            fa: "کارا پرداز اوند",
            en: "Kara Pardaz Oond",
          },
          focus: {
            fa: "تحویل نرم‌افزار سازمانی برای کسب‌وکارهای ایرانی",
            en: "Enterprise software delivery for Iranian businesses",
          },
        },
      ],
      team: [],
      culture: [
        {
          id: "code-ownership",
          title: {
            fa: "مالکیت کد",
            en: "Code ownership",
          },
          body: {
            fa: "خروجی مهندسی در اختیار شماست؛ بدون قفل فروشنده روی دسترسی و انتقال.",
            en: "Engineering output stays with you—no vendor lock on access or transfer.",
          },
          needs_business_confirmation: true,
        },
        {
          id: "documentation",
          title: {
            fa: "مستندسازی عملیاتی",
            en: "Operational documentation",
          },
          body: {
            fa: "مستندات استقرار، نقش‌ها و مسیر عیب‌یابی بخشی از تحویل است؛ نه پیوست اختیاری.",
            en: "Deploy docs, roles, and troubleshooting paths ship with delivery—not as an optional add-on.",
          },
          needs_business_confirmation: true,
        },
        {
          id: "staged-delivery",
          title: {
            fa: "تحویل مرحله‌ای",
            en: "Staged delivery",
          },
          body: {
            fa: "قابلیت‌ها در گام‌های قابل بررسی می‌رسند تا ریسک زود دیده شود و اولویت‌ها اصلاح‌پذیر بماند.",
            en: "Capabilities arrive in reviewable stages so risk surfaces early and priorities stay adjustable.",
          },
          needs_business_confirmation: true,
        },
      ],
    });
    console.log("About document seeded successfully.");
  } else {
    console.log("About document already exists, skipping create.");
  }

  // 2. Seed Process
  const existingProcess = await Process.findOne();
  if (!existingProcess) {
    console.log("Creating default Process document...");
    await Process.create({
      hero: {
        titleBefore: {
          fa: "فرایند همکاری؛ از تحلیل نیاز تا ",
          en: "Collaboration process; from needs analysis to ",
        },
        titleGradient: {
          fa: "تحویل پایدار",
          en: "reliable delivery",
        },
        titleAfter: {
          fa: " نرم‌افزار",
          en: " of software",
        },
        lead: {
          fa: "مسیر شفاف مهندسی با خروجی‌های ملموس، زمان‌بندی واقع‌گرایانه و مالکیت کامل سورس و دسترسی‌ها برای کارفرما.",
          en: "A transparent engineering roadmap with concrete deliverables, realistic milestones, and full client source code ownership.",
        },
      },
      steps: [
        {
          id: "discover",
          number: 1,
          title: {
            fa: "تحلیل نیاز",
            en: "Needs analysis",
          },
          purpose: {
            fa: "مسئله، محدودیت‌ها و معیارهای موفقیت را پیش از هر طراحی روشن می‌کنیم.",
            en: "We clarify the problem, constraints, and success criteria before any design work.",
          },
          deliverables: [
            {
              fa: "خلاصهٔ مسئله و اهداف قابل اندازه‌گیری",
              en: "Problem brief and measurable goals",
            },
            {
              fa: "فهرست ذی‌نفعان و نقش‌ها",
              en: "Stakeholder and role map",
            },
            {
              fa: "محدودهٔ اولیه و فرضیات باز",
              en: "Initial scope and open assumptions",
            },
          ],
          clientInvolvement: {
            fa: "دسترسی به تصمیم‌گیر و نمونه‌هایی از فرایند یا دادهٔ فعلی لازم است.",
            en: "Access to a decision-maker and samples of current process or data is required.",
          },
          duration: null,
        },
        {
          id: "design",
          number: 2,
          title: {
            fa: "طراحی راه‌حل",
            en: "Solution design",
          },
          purpose: {
            fa: "معماری، جریان‌ها و مرزهای سیستم را طوری می‌چینیم که قابل ساخت و نگهداری باشد.",
            en: "We shape architecture, flows, and system boundaries so the solution is buildable and maintainable.",
          },
          deliverables: [
            {
              fa: "نقشهٔ سیستم و جریان‌های اصلی",
              en: "System map and primary flows",
            },
            {
              fa: "پیشنهاد استک و یکپارچه‌سازی‌ها",
              en: "Stack proposal and integrations",
            },
            {
              fa: "برنامهٔ فازبندی تحویل",
              en: "Phased delivery plan",
            },
          ],
          clientInvolvement: {
            fa: "بازبینی و تایید نقشهٔ راه‌حل و اولویت فازها با شما انجام می‌شود.",
            en: "You review and approve the solution map and phase priorities.",
          },
          duration: null,
        },
        {
          id: "build",
          number: 3,
          title: {
            fa: "توسعه مرحله‌ای",
            en: "Incremental development",
          },
          purpose: {
            fa: "قابلیت‌ها را در تکرارهای کوتاه می‌سازیم تا ریسک زود دیده شود و مسیر قابل اصلاح بماند.",
            en: "We ship capabilities in short iterations so risk surfaces early and the path stays adjustable.",
          },
          deliverables: [
            {
              fa: "نسخه‌های قابل استفاده در محیط آزمایش",
              en: "Usable staging releases",
            },
            {
              fa: "گزارش پیشرفت و تصمیم‌های باز",
              en: "Progress notes and open decisions",
            },
            {
              fa: "آزمون‌های پایه روی مسیرهای حیاتی",
              en: "Baseline tests on critical paths",
            },
          ],
          clientInvolvement: {
            fa: "بازخورد منظم روی هر نسخه و اولویت‌بندی بک‌لاگ با تیم شما هماهنگ می‌شود.",
            en: "Regular feedback on each release and backlog priorities are coordinated with your team.",
          },
          duration: null,
        },
        {
          id: "handoff",
          number: 4,
          title: {
            fa: "تحویل و آموزش",
            en: "Handoff and training",
          },
          purpose: {
            fa: "سیستم را به‌صورت پایدار به بهره‌برداری می‌رسانیم و تیم شما را برای استفاده و نگهداری آماده می‌کنیم.",
            en: "We bring the system into production reliably and prepare your team for operation and maintenance.",
          },
          deliverables: [
            {
              fa: "استقرار در زیرساخت نهایی",
              en: "Production deployment",
            },
            {
              fa: "مستندات راه‌اندازی و نگهداری",
              en: "Setup and operations runbook",
            },
            {
              fa: "جلسات انتقال دانش برای راهبران",
              en: "Admin walkthrough sessions",
            },
          ],
          clientInvolvement: {
            fa: "آماده‌سازی زیرساخت نهایی و حضور کاربران کلیدی در جلسات انتقال دانش لازم است.",
            en: "Provisioning production infrastructure and attendance of key staff in walkthroughs is required.",
          },
          duration: null,
        },
        {
          id: "support",
          number: 5,
          title: {
            fa: "پشتیبانی و بهبود",
            en: "Support and iteration",
          },
          purpose: {
            fa: "پایداری سیستم را تضمین می‌کنیم و آن را بر اساس بازخورد کاربران ارتقا می‌دهیم.",
            en: "We ensure stability and iterate based on actual operational feedback.",
          },
          deliverables: [
            {
              fa: "پایش سلامت و پاسخ به رخدادها",
              en: "Health monitoring and incident response",
            },
            {
              fa: "بک‌لاگ بهبود اولویت‌بندی‌شده",
              en: "Prioritized improvement backlog",
            },
          ],
          clientInvolvement: {
            fa: "کانال ارتباط و زمان پاسخ توافق‌شده برای گزارش مشکل و درخواست تغییر لازم است.",
            en: "An agreed channel and response window for issues and change requests is required.",
          },
          duration: null,
        },
      ],
      engagementModels: [
        {
          id: "fixed-scope",
          title: {
            fa: "پروژه با دامنه‌ی مشخص",
            en: "Fixed-scope project",
          },
          description: {
            fa: "دامنه، خروجی‌ها و زمان‌بندی در ابتدای همکاری توافق می‌شود؛ مناسب وقتی مسئله و مرزها روشن است.",
            en: "Scope, deliverables, and timeline are agreed up front—best when the problem and boundaries are clear.",
          },
          needs_business_confirmation: true,
        },
        {
          id: "dedicated-team",
          title: {
            fa: "تیم اختصاصی",
            en: "Dedicated team",
          },
          description: {
            fa: "یک تیم پایدار روی بک‌لاگ شما کار می‌کند؛ ظرفیت و اولویت‌ها به‌صورت دوره‌ای بازبینی می‌شود.",
            en: "A steady team works your backlog; capacity and priorities are reviewed on a recurring cadence.",
          },
          needs_business_confirmation: true,
        },
        {
          id: "monthly-support",
          title: {
            fa: "پشتیبانی ماهانه",
            en: "Monthly support",
          },
          description: {
            fa: "پس از تحویل، پایش، رفع اشکال و بهبودهای کوتاه‌مدت در قالب قرارداد ماهانه تعریف می‌شود.",
            en: "After handoff, monitoring, fixes, and short-cycle improvements run under a monthly agreement.",
          },
          needs_business_confirmation: true,
        },
      ],
      communicationRows: [
        {
          id: "reporting",
          label: {
            fa: "ریتم گزارش‌دهی",
            en: "Reporting rhythm",
          },
          value: {
            fa: "خلاصهٔ پیشرفت و تصمیم‌های باز در بازه‌های توافق‌شده (معمولاً هفتگی) ارسال می‌شود.",
            en: "Progress summaries and open decisions are shared on an agreed cadence (typically weekly).",
          },
          needs_business_confirmation: true,
        },
        {
          id: "demo",
          label: {
            fa: "زمان‌بندی دمو",
            en: "Demo cadence",
          },
          value: {
            fa: "در پایان هر تکرار کوتاه، نسخهٔ قابل مشاهده برای بازخورد شما آماده می‌شود.",
            en: "At the end of each short iteration, a reviewable build is ready for your feedback.",
          },
          needs_business_confirmation: true,
        },
      ],
      guide: {
        title: {
          fa: "راهنمای شفاف تعامل و استانداردهای تحویل نرم‌افزار",
          en: "Clear Collaboration Guide and Delivery Standards",
        },
        tiptapBody: {
          fa: {
            html: "<p>در کارا پرداز اوند، تمام کدهای نوشته‌شده، تست‌ها و تنظیمات خطوط استقرار (CI/CD) به صورت شفاف و از همان روزهای اول همکاری در اختیار کارفرما قرار می‌گیرد. ما به هیچ عنوان قفل فنی (Vendor Lock-in) ایجاد نمی‌کنیم تا تیم‌های شما با آرامش و استقلال کامل بتوانند محصول را توسعه دهند.</p>",
            json: null,
          },
          en: {
            html: "<p>At Kara Pardaz Oond, all source code, automated test suites, and CI/CD pipelines are handed over completely with full client ownership from day one. We never introduce vendor lock-in, ensuring your team has total independence.</p>",
            json: null,
          },
        },
      },
    });
    console.log("Process document seeded successfully.");
  } else {
    console.log("Process document already exists, skipping create.");
  }

  console.log("Seeding completed successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
