import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectToDatabase } from "../src/lib/db/mongodb";
import { SupportedProject } from "../src/lib/db/models/SupportedProject";
import { SupportTicket } from "../src/lib/db/models/SupportTicket";

async function seedTickets() {
  console.log("🌱 Seeding Multi-Tenant Ticketing Engine...\n");

  await connectToDatabase();

  const amlakSecret = "kp_live_amlak_secret123";
  const clinicSecret = "kp_live_clinic_secret456";

  const amlakHash = await bcrypt.hash(amlakSecret, 10);
  const clinicHash = await bcrypt.hash(clinicSecret, 10);

  // 1. Seed Projects
  console.log("1. Seeding Supported Projects...");
  const amlakProject = await SupportedProject.findOneAndUpdate(
    { projectId: "amlak" },
    {
      projectId: "amlak",
      name: "سامانه جامع مدیریت املاک",
      apiKeyHash: amlakHash,
      isActive: true,
      departments: [
        { id: "technical", nameFa: "پشتیبانی فنی و باگ‌ها" },
        { id: "contracts", nameFa: "قراردادها و فایلینگ" },
        { id: "billing", nameFa: "امور مالی و فاکتورها" },
        { id: "general", nameFa: "آموزش و مشاوره عمومی" },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const clinicProject = await SupportedProject.findOneAndUpdate(
    { projectId: "clinic" },
    {
      projectId: "clinic",
      name: "سامانه مدیریت کلینیک و سلامت",
      apiKeyHash: clinicHash,
      isActive: true,
      departments: [
        { id: "insurance", nameFa: "استعلام بیمه و نسخه" },
        { id: "booking", nameFa: "نوبت‌دهی آنلاین" },
        { id: "technical", nameFa: "پشتیبانی سرور و سیستم" },
      ],
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`   ✅ Project created/updated: ${amlakProject.name} (Key: ${amlakSecret})`);
  console.log(`   ✅ Project created/updated: ${clinicProject.name} (Key: ${clinicSecret})`);

  // 2. Seed Mock Tickets
  console.log("\n2. Seeding Realistic Support Tickets...");

  // Remove previous sample tickets for these projects
  await SupportTicket.deleteMany({ projectId: { $in: ["amlak", "clinic"] } });

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const tickets = [
    {
      ticketNumber: "TK-AMLAK-1001",
      projectId: "amlak",
      requester: {
        userId: "usr_amlak_01",
        name: "حامد سعیدی",
        phone: "09121112233",
        email: "h.saeedi@negin-amlak.ir",
        organization: "آژانس املاک نگین جردن",
      },
      department: "technical",
      priority: "HIGH",
      subject: "عدم بارگذاری فیلتر متراژ و قیمت در بخش متقاضیان",
      status: "OPEN",
      messages: [
        {
          senderRole: "CLIENT_USER",
          senderId: "usr_amlak_01",
          senderName: "حامد سعیدی (املاک نگین)",
          message:
            "سلام و احترام. از صبح امروز هنگام جستجوی متقاضیان ملکی با بودجه بالای ۲۰ میلیارد تومان، صفحه لودینگ باقی می‌ماند و نتیجه‌ای نمایش داده نمی‌شود. لطفاً بررسی فرمایید.",
          createdAt: twoHoursAgo,
        },
      ],
      lastMessageAt: twoHoursAgo,
    },
    {
      ticketNumber: "TK-AMLAK-1002",
      projectId: "amlak",
      requester: {
        userId: "usr_amlak_02",
        name: "مریم زارعی",
        phone: "09358889900",
        email: "m.zarei@paytakht.ir",
        organization: "املاک پایتخت سعادت‌آباد",
      },
      department: "contracts",
      priority: "MEDIUM",
      subject: "درخواست تغییر متن پیش‌فرض مبایعه‌نامه چاپی",
      status: "ANSWERED",
      messages: [
        {
          senderRole: "CLIENT_USER",
          senderId: "usr_amlak_02",
          senderName: "مریم زارعی (املاک پایتخت)",
          message:
            "با سلام. ماده ۴ پیش‌نویس مبایعه‌نامه برای قراردادهای رهن و اجاره نیاز به بند تبصره تاخیر تادیه دارد. آیا امکانش هست این بند به تنظیمات چاپی اضافه شود؟",
          createdAt: oneDayAgo,
        },
        {
          senderRole: "SUPPORT_AGENT",
          senderId: "agent_kp_01",
          senderName: "تیم فنی کاراپرداز (مهندس رضایی)",
          message:
            "درود سرکار خانم زارعی. این قابلیت در بخش «تنظیمات سامانه > قالب‌های چاپ قرارداد» در دسترس قرار گرفت. می‌توانید قالب سفارشی خود را با بندهای دلخواه ذخیره کنید.",
          createdAt: new Date(oneDayAgo.getTime() + 30 * 60 * 1000),
        },
      ],
      lastMessageAt: new Date(oneDayAgo.getTime() + 30 * 60 * 1000),
    },
    {
      ticketNumber: "TK-AMLAK-1003",
      projectId: "amlak",
      requester: {
        userId: "usr_amlak_03",
        name: "سهراب کریمی",
        phone: "09124445566",
        email: "sohrab@vazara.com",
        organization: "دپارتمان مسکن وزرا",
      },
      department: "technical",
      priority: "URGENT",
      subject: "کندی در باز شدن گالری تصاویر املاک لوکس",
      status: "IN_PROGRESS",
      messages: [
        {
          senderRole: "CLIENT_USER",
          senderId: "usr_amlak_03",
          senderName: "سهراب کریمی (املاک وزرا)",
          message:
            "سلام، عکس‌های با کیفیت فایل‌های پنت‌هاوس لود بسیار کندی دارند و مشاوران ما هنگام پرزنت به مشتری دچار مشکل می‌شوند.",
          createdAt: twoDaysAgo,
        },
        {
          senderRole: "SUPPORT_AGENT",
          senderId: "agent_kp_02",
          senderName: "تیم زیرساخت کاراپرداز",
          message:
            "سلام و ادب. در حال تنظیم و فعال‌سازی کش CDN و وب‌پی (WebP Compression) خودکار روی فایل‌های تصویری هستیم.",
          createdAt: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
        },
      ],
      lastMessageAt: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
    },
    {
      ticketNumber: "TK-CLINIC-2001",
      projectId: "clinic",
      requester: {
        userId: "usr_clinic_01",
        name: "دکتر مژگان صبوری",
        phone: "09127778899",
        email: "dr.sabouri@alborz-clinic.com",
        organization: "کلینیک تخصصی البرز",
      },
      department: "insurance",
      priority: "URGENT",
      subject: "خطای وب‌سرویس استعلام استحقاق درمان تأمین اجتماعی",
      status: "OPEN",
      messages: [
        {
          senderRole: "CLIENT_USER",
          senderId: "usr_clinic_01",
          senderName: "دکتر مژگان صبوری (کلینیک البرز)",
          message:
            "سلام. در بخش پذیرش، هنگام وارد کردن کد ملی بیماران خطای کد ۴۰۳ وب‌سرویس بیمه بازگردانده می‌شود. نوبت‌دهی معطل مانده است.",
          createdAt: new Date(now.getTime() - 45 * 60 * 1000),
        },
      ],
      lastMessageAt: new Date(now.getTime() - 45 * 60 * 1000),
    },
  ];

  await SupportTicket.insertMany(tickets);
  console.log(`   ✅ Seeded ${tickets.length} support tickets across projects.`);

  await mongoose.disconnect();
  console.log("\n🎉 Seeding completed successfully!\n");
}

seedTickets().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
