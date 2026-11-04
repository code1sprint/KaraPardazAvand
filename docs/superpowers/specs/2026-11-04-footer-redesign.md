# Site Footer Redesign Design Document (Approach 1: The Modern Tech Monolith)

## Intent & Why
The current footer uses a basic band CTA and plain link columns. While functional, it does not match the elevated, world-class tech feel of Kara Pardaz Avand (sister brand of Code1Sprint). The redesign transforms the footer into an impressive, modern tech monolith inspired by modern leaders (Linear, Supabase, Raycast), making it a memorable closing statement on every page.

## Goals
- **Elevate CTA:** Replace the flat band with an elevated, floating Bento launchpad with ambient lighting, eyebrow badge, and dual actions (primary consultation button + secondary explore link).
- **High-tech Brand Presence:** Introduce a live engineering status indicator (`● کلیه سیستم‌ها فعال است` / `All systems operational`) with a pulsing green indicator.
- **Refined Social & Contact Channels:** Modernize contact channels with crisp interactive pills/badges.
- **Subtle Massive Typographic Watermark:** Add an ultra-subtle, bold geometric brand mark (`KARA PARDAZ AVAND`) in the background layer at low opacity (3-4%) without obstructing readable text.
- **Full A11y & RTL:** Keep AA color contrast, logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`), and full screen-reader semantic structure.

## Non-Goals & Anti-Goals
- No fake external certification badges or non-existent client logos.
- No heavy JavaScript dependencies or bulky icon libraries; use lightweight inline SVGs.
- Not a disruptive layout restructuring that breaks navigation.

## Approaches Considered
1. **The Modern Tech Monolith (Chosen):** Floating launchpad CTA card + deep navy tech grid + system status badge + low-opacity typographic watermark + refined social links.
2. **Clean Architectural Grid:** Flat continuous grid with vertical line dividers (`border-x`). Good, but less visually impactful for a tech product brand.
3. **Interactive Terminal Console:** Terminal-style prompt for CTA. More complex and may alienate non-technical enterprise decision-makers.

## Detailed Component Specifications

### 1. Pre-Footer Floating CTA Launchpad
- Wrapper: Centered within `Container`, with negative vertical margin or clean spacing on light canvas.
- Background: Deep navy (`linear-gradient(135deg, var(--win-deep), var(--navy))`), `rounded-[28px]`, `border border-white/10`, ambient radial sky/amber glow in the center.
- Micro-dots texture with radial mask.
- Eyebrow: `آماده شروع پروژه بعدی؟` with orange `TriMarker`.
- Heading: `بیایید سیستم بعدی سازمان شما را بسازیم`.
- Actions:
  - Primary button: `درخواست مشاوره` (size md/lg with hover lift).
  - Secondary button: `مشاهده فرایند همکاری` (ghost button on dark surface).

### 2. Main Footer Tech Grid
- Background: `bg-[linear-gradient(180deg,var(--navy),#040c1e)]` with a subtle top border and light beam separator.
- Watermark: Faded oversized typographic wordmark across the lower area.
- Brand column (col-span-4):
  - Brand mark & title
  - Description text
  - Live status indicator: `● کلیه سیستم‌ها فعال و آماده همکاری` (with emerald pulse dot `animate-pulse`)
  - Parent brand link (`از خانواده Code1Sprint`)
- Services column (col-span-2 or 3):
  - 6 services with localized titles and subtle hover transitions
- Resources column (col-span-2):
  - Work, Insights, FAQ, Process
- Contact column (col-span-3):
  - Phone, Email, Telegram, LinkedIn, GitHub with dedicated inline icon badges.

### 3. Bottom Legal & Copyright Bar
- Clean separator (`border-t border-white/5`).
- Legal links (`حریم خصوصی`, `شرایط استفاده`).
- Copyright statement.
