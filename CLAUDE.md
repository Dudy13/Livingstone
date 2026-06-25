# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for **Livingstone — Family Office**, a French private wealth-management firm (founder: Mikael Gueviguian). All copy is in French. Pure static site — **no build step, no package.json, no test suite, no linter.** Edits land directly in HTML/CSS/JS.

## Local preview & deploy

- Preview: open `index.html` in a browser, or run any static server from the repo root (e.g. `python -m http.server 8000`).
- Hosted on **Vercel**. `vercel.json` sets `cleanUrls: true` (so `/mentions-legales` resolves to `mentions-legales.html` — internal links use the `.html` suffix today, which still works), security headers, and a 1-year immutable cache on `/images/*`. Keep image filenames stable or bust the cache by renaming.

## Page map

- `index.html` — main public page, linked from navigation. All marketing sections (hero, approche, solutions, équipe, comparatif, frais, portrait, médias, valorisation, contact).
- `mentions-legales.html`, `confidentialite.html`, `reclamations.html` — legal pages linked from the footer.
- `cas-pratiques.html` — hub page listing case-study articles. Linked from `index.html` nav (between Médias and Valorisation) and footer.
- `cas-pratiques/*.html` — one HTML file per case study. Production URL: `/cas-pratiques/<slug>` (cleanUrls). All paths to root assets must be prefixed `../` (`../styles.css`, `../script.js`, `../images/...`, `../cas-pratiques.html`, `../index.html#contact`).
- `qualification.html`, `acces-prive.html` — **intentionally unlinked from navigation**. Both carry `<meta name="robots" content="noindex, nofollow">` and are reached only by direct URL (private placement / qualified-investor flows under art. L. 411-2 I CMF). Do not add them to the nav or sitemap; do not remove the noindex tags.

## Case-study article gabarit

Each article in `cas-pratiques/` follows the same skeleton (use the existing file as the template). When creating a new case study, update:

- `<title>`, meta description, `<link rel="canonical">`, and all OG tags (`og:title`, `og:description`, `og:url`, `og:image`, `article:published_time`, `article:modified_time`, `article:section`)
- **Two JSON-LD scripts** in the `<head>`: an `Article` block (headline, description, datePublished, dateModified, author=Mikael Guéviguian, publisher=Livingstone Family Office) and a `FAQPage` block whose `Question`/`Answer` entries must mirror the on-page FAQ markup 1-for-1
- Heading hierarchy: a single `<h1>` in the article header, `<h2>` for major sections, `<h3>` for sub-sections and FAQ questions — never skip a level
- The hidden form fields `_subject` ("Cas pratique — <titre>") and `source` ("/cas-pratiques/<slug>") in the bottom CTA so Formspree submissions are attributable
- The CTA submit button label must stay action-oriented ("Échanger sur ma situation"), never "Envoyer"
- Add the new URL to `sitemap.xml` (cleanUrl form, no `.html`) and add a card to `cas-pratiques.html` (both the visible grid and the `ItemList` JSON-LD)

## Compliance footer (CIF / ORIAS)

`cas-pratiques.html` and articles ship a **richer footer** than `index.html` today: under the standard footer links sits a `.footer-compliance` block with Livingstone's SARL identifiers and the ORIAS 23007478 / CIF (Compagnie des CGP) / CNCEF Assurance mentions required for AMF/ACPR-regulated activity. Keep this block on every public case-study page. The wording is the authoritative version from `mentions-legales.html`. `index.html` does **not** carry this block yet — it should be added separately, not removed here.

## SEO files

- `sitemap.xml` (root) — lists `/`, `/cas-pratiques`, every `/cas-pratiques/<slug>`, and the legal pages. **Never** add `qualification` or `acces-prive` here.
- `robots.txt` (root) — allows all, explicitly disallows the two noindex pages (both with and without `.html` suffix, since cleanUrls), and points to the sitemap.

## Styling architecture

There are **three independent style systems** — don't try to unify them:

1. **`styles.css`** (~1070 lines) — shared stylesheet for `index.html` and the legal pages. Palette in `:root`: charbon `#111111`, gold `#8B7355`, cream `#F5F0E8`. Typography: Cormorant Garamond (serif headings) + system sans for body. Mobile breakpoint at 768px.
2. **Inline `<style>` block inside the `index.html` hero** (lines ~50–128) — scoped class names with `-a` suffix (`.wordmark-a`, `.stat-num-a`, etc.) for a multi-scene intro animation driven by an IIFE later in the same file. Changing the hero usually means editing all three: the `<style>`, the scene markup, and the JS timeline.
3. **`acces-prive.html` and `qualification.html` ship their own full `<style>` blocks** with a different palette (ivory `#F2EBDF`, warmer gold `#C9A87C`) and different fonts (Cinzel + EB Garamond / Montserrat). They do **not** consume `styles.css`. Treat them as standalone documents.

`script.js` is loaded only by `index.html` and the legal pages; it handles the mobile burger (`#burger` / `#navMobile`) and a scroll-triggered nav shadow. The hero animation has its own inline script.

## Conventions worth knowing

- **Logo assets**: nav and footer (and the legal-pages `.legal-logo`) use the horizontal `images/livingstone_nav.png` (1200×420, transparent). Favicon, JSON-LD `publisher.logo`, JSON-LD article `image`, and `og:image` use the square `images/livingstone_carre.png` (1080×1080). These are the only two logo files in the repo — older variants (`livingstone_logo_carre_1080.png`, `livingstone_logo_banniere_1920x1080.png`, the never-existed `livingstone-profil-facebook-720x720.png`) have been removed.
- Contact form posts to Formspree (`https://formspree.io/f/xqegldel`). Server-side handling lives there, not in this repo.
- YouTube embeds in the "Médias" section use `youtube-nocookie.com` — keep that domain when adding videos.
- The site serves **compressed web versions**: `images/bureau-web.jpg` (~236 KB) and `images/mikael-portrait-web.jpg` (~124 KB), both 2000 px wide / JPEG q80, referenced by `index.html`. The high-res originals `images/bureau.jpg` (~24 MB) and `images/mikael-portrait.jpg` (~15 MB) are kept as masters but **not served** — don't reference them from pages. If you add or replace photos, compress before committing (e.g. sharp: resize 2000 px, JPEG q80) — assets ship as-is to every visitor.
- `.gitignore` excludes `.claude/` and `*.txt` (local scratch). Don't commit either.
