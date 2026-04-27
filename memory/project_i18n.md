---
name: Multi-language i18n implementation
description: Full EN/FR/RW translation coverage across all pages and components
type: project
---

All UI strings wired through `t(language, key)` from `src/lib/translations.ts`. Added `tCat(lang, englishName)` helper for category names (maps e.g. "Food Products" → catFood key). Language persists across navigation via zustand `persist` middleware (`simba-store` key).

**Why:** Requirement to support EN/FR/RW as Rwanda is trilingual; previously ~60% of strings were hardcoded English.

**How to apply:** When adding new UI strings, always add a key to all three language objects in `translations.ts`, then use `t(language, 'yourKey')` in components. For category names use `tCat(language, cat)`.
