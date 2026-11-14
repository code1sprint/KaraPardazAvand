# Portfolio live URL (`liveUrl`)

## Goal
Each case study can optionally expose a live project URL (from Code1Sprint `link` data), editable in admin, shown on the portfolio list and case-study detail.

## Field
- Name: `liveUrl` (optional string URL)
- Empty / missing → no visit CTA
- Not `#` placeholders — omit the field instead

## Seed mapping (Code1Sprint)
| slug | liveUrl |
|------|---------|
| betonika | https://code1sprint.github.io/Betonika/ |
| goldenoo | https://code1sprint.github.io/Goldenoo/ |
| luxoria | https://code1sprint.github.io/Luxoria-Hotel/ |
| zara-elite | https://code1sprint.github.io/Zara-Elite/ |
| ironstec | https://code1sprint.github.io/ironstec/ |
| amlak-paliz | https://amlakepaliz.ir |
| noir | https://code1sprint.github.io/NOIR/ |
| clinick, parak-store, rag-parak, pilots | (none) |

## Surfaces
1. MDX frontmatter + Zod content schema + Mongo + admin validation + seed
2. Admin `ProjectForm`: editable «لینک زنده»
3. `ProjectRow` list + `/portfolio/[slug]` detail: external CTA when set

## Out of scope
Adding Code1Sprint-only projects (BeautyQueen, Artam, Diplomat, Mana).
