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
- `fiducie-surete.html` — **institutional** page on the fiducie-sûreté: why Livingstone secures its private-debt operations this way, 120–400 % collateral. Commercial angle, in the nav-adjacent trust cluster with `nos-frais.html`.
- `nos-frais.html` — fee transparency page (0 % entry, 0.66 % running of which 0.15 % Livingstone).
- `cas-pratiques/fiducie-surete-garantir-un-financement-sans-vendre.html` — **pedagogical** page on the same instrument, seen from the borrower's side. The two fiducie pages are deliberate and complementary; they cross-link, and their titles and canonicals are distinct so they do not compete in search. Do not merge them.
- `merci-guide.html` — thank-you page reached only after the guide form redirect (Formspree `_next`). Carries `noindex`, is **not** in `sitemap.xml`, and hosts step 2 of the funnel (booking). Do not link it from navigation.
- `documents/livingstone-guide-cession-dirigeant.pdf` — the lead magnet, regenerated from the guide page (see "Regenerating the PDF").
- `qualification.html`, `acces-prive.html` — **intentionally unlinked from navigation**. Both carry `<meta name="robots" content="noindex, nofollow">` and are reached only by direct URL (private placement / qualified-investor flows under art. L. 411-2 I CMF). Do not add them to the nav or sitemap; do not remove the noindex tags.

## Case-study article gabarit

Each article in `cas-pratiques/` follows the same skeleton (use the existing file as the template). When creating a new case study, update:

- `<title>`, meta description, `<link rel="canonical">`, and all OG tags (`og:title`, `og:description`, `og:url`, `og:image`, `article:published_time`, `article:modified_time`, `article:section`)
- **Two JSON-LD scripts** in the `<head>`: an `Article` block (headline, description, datePublished, dateModified, author=Mikael Guéviguian, publisher=Livingstone Family Office) and a `FAQPage` block whose `Question`/`Answer` entries must mirror the on-page FAQ markup 1-for-1
- Heading hierarchy: a single `<h1>` in the article header, `<h2>` for major sections, `<h3>` for sub-sections and FAQ questions — never skip a level
- The hidden form fields `_subject` ("Cas pratique — <titre>") and `source` ("/cas-pratiques/<slug>") in the bottom CTA so Formspree submissions are attributable
- The CTA submit button label must stay action-oriented ("Échanger sur ma situation"), never "Envoyer"
- Add the new URL to `sitemap.xml` (cleanUrl form, no `.html`) and add a card to `cas-pratiques.html` (both the visible grid and the `ItemList` JSON-LD)

## Acquisition funnel

The site is the capture layer only — no backend, no build step. Everything downstream
(delivery, nurturing, booking) lives in external SaaS.

```
8 case studies + hub  →  .guide-offer band, data-lv="guide"
                      →  /ceder-son-entreprise-guide-du-dirigeant#recevoir
                      →  email required, phone OPTIONAL
                      →  Formspree, then _next redirect
                      →  merci-guide.html : PDF + booking (phone REQUIRED here)
```

**Every case study carries a `.guide-offer` band** under its header, worded for its
own topic and linking to the guide. Without it a case study is a dead end: the
reader who is not ready to talk leaves nothing behind. Add one to every new case
study — it is part of the gabarit, not an option.

Two rules that are deliberate, not oversights:

- **The phone is optional at step 1 and required at step 2.** A required phone on a
  first form costs conversions and yields fake numbers. At step 2 the person is
  asking for the call, so the number is natural and the contact rate is far higher.
- **A phone number is never collected without its own consent checkbox**
  (`consentement_appel`). Since French cold-calling moved to opt-in, a number
  gathered without explicit consent cannot legally be called.

`merci-guide.html` holds a `LV_AGENDA` constant at the top of its inline script.
Paste a Cal.com/Calendly link there and the iframe replaces the fallback form
automatically; leave it empty and the fallback form stays. Nothing else to change.

Formspree remains the transport. It delivers, it does not sequence — the nurturing
sequence in `docs/sequence-emails-cession.md` has to be created in an emailing tool
(Brevo et al.) for the funnel to actually pay off.

## Analytics & consent

`analytics.js` is the single shared measurement file, loaded on every public page.
It injects the consent banner in JS (no markup to duplicate), loads **nothing**
before an explicit accept, and exposes `window.lvTrack(name, params)` and
`window.lvLead(params)` for conversions. IDs live at the top of the file; `GA4_ID`
is empty until the property exists, in which case the Google script is simply not
inserted.

The choice is stored under `lv_consentement` — the **same key** as the inline
system in `swisslife-altitude.html`, so a visitor answers once for the whole site.

Deliberately **not** carrying `analytics.js`:

- `index.html` — untouched by request (video portal). Adding it is a one-line change.
- `swisslife-altitude.html` — has its own inline banner and pixels; adding the shared
  file would show two banners.
- `qualification.html`, `acces-prive.html` — private placement flows; no tracker is
  sent from them on purpose.

Any element with `id="lv-consent-rouvrir"` reopens the choice; the footer of every
page carries one.

**Conversions are wired from the markup, not per page.** `analytics.js` attaches on
load and needs no page-level script:

- every `form[action*="formspree"]` fires `lvLead({source})`, taken from the form's
  hidden `source` field — so a lead is attributable to the exact page;
- a form carrying `data-lv-event="x"` fires `x` instead of a lead (the booking form
  on `merci-guide.html` fires `prise_rdv`: it is the next step, not another lead);
- any element carrying `data-lv="guide"` fires `depart_guide({source})` — this is
  what tells you which case studies actually feed the funnel.

Never re-add a per-page tracking script; it will double-count.

## Regenerating the guide PDF

The PDF is built from the live page content with headless Chromium, so the page
stays the single source of truth:

1. extract `<article class="article-body">` from `ceder-son-entreprise-guide-du-dirigeant.html`
2. wrap it in a print template (A4, cover page, embedded Cormorant Garamond as
   base64 `@font-face` — Google Fonts is not reachable at print time, and without
   the embed the PDF silently falls back to a generic serif)
3. `chrome --headless --no-pdf-header-footer --print-to-pdf=...`

Re-run it whenever the guide text changes, otherwise the PDF and the page drift apart.

## Compliance footer (CIF / ORIAS)

Under the standard footer links sits a `.footer-compliance` block with Livingstone's SARL identifiers and the ORIAS 23007478 / CIF (Compagnie des CGP) / CNCEF Assurance mentions required for AMF/ACPR-regulated activity. The wording is the authoritative version from `mentions-legales.html`.

Every public page now carries it, `index.html` included. The three legal pages used to ship their own `.legal-header` / `.legal-footer` chrome with no nav and no compliance block; they now use the same `.nav` and `.footer` as the rest of the site, keeping only their dark `body.legal-page` background.

## SEO files

- `sitemap.xml` (root) — lists `/`, `/cas-pratiques`, every `/cas-pratiques/<slug>`, and the legal pages. **Never** add `qualification` or `acces-prive` here.
- `robots.txt` (root) — allows all, explicitly disallows the two noindex pages (both with and without `.html` suffix, since cleanUrls), and points to the sitemap.

## Styling architecture

The site runs **two charters at once**, on purpose.

1. **Perle/pétrole — `styles.css` + `refonte.css`, in that order.** Every internal page loads both. `refonte.css` is the authoritative charter: pearl ground `#F1F3F4`, ink `#12181C`, petrol accent `#1C4A55`, brass `#A9853F` reserved for dark surfaces and the logo. Fonts: Newsreader (headings), Public Sans (body), IBM Plex Mono (eyebrows, buttons, nav).
2. **Crème/doré — `styles.css` alone.** Only `index.html`, the five-scene video portal (`.pv` sections, `videos/*.mp4` lazy-loaded by IntersectionObserver, scroll-snap in a small inline `<style>`). **It must not be restyled or restructured**, and it must never load `refonte.css`.
3. **`acces-prive.html`, `qualification.html` and `swisslife-altitude.html`** ship their own full `<style>` blocks and consume neither. Standalone documents.

**How the re-skin works — read this before touching colours.** `styles.css` is ~80 % written against CSS custom properties, so `refonte.css` re-skins the whole site by redefining the tokens (`--gold`, `--cream`, `--navy`, `--text-*`, `--border-*`) rather than by rewriting markup. Dark regions (`.nav`, `.footer`, `.article-cta`, `.rdv`, `.legal-page`, `#lv-consent`) re-scope `--gold` to brass, because petrol is unreadable on ink. The handful of colours hardcoded in `styles.css` are overridden by name at the end of `refonte.css`.

Consequence: **never edit `styles.css` to change a colour or a font.** It is the homepage's stylesheet; editing it changes `index.html`. All charter work happens in `refonte.css`.

**The nav is `sticky` in this charter** (`refonte.css`), not `fixed` as `styles.css` declares. `--nav-h` is therefore forced to `0` — the bar occupies flow space and there is nothing to compensate. `.article`, `.cas-hub`, `.merci` and `.page-top` fall back to a plain section padding. If the nav ever returns to `fixed`, restore `--nav-h` to the measured height (72px desktop, 63px under 480px).

**Repeated inline styles have been promoted to classes** — `.author-link`, `.link-gold`, `.figure` / `.figure-caption` (SVG schemas), `.guide-toc`, `.hub-guide`. Use these rather than re-inlining, otherwise a change means editing a dozen files.

`script.js` is loaded by every page that consumes `styles.css` — including the legal pages, which now have the burger menu too (the standalone `acces-prive.html`, `qualification.html` and `swisslife-altitude.html` do not); it handles the mobile burger (`#burger` / `#navMobile`) and a scroll-triggered nav shadow. The video portal on `index.html` has its own inline script.

## Conventions worth knowing

- **Logo assets**: nav and footer (and the legal-pages `.legal-logo`) use the horizontal `images/livingstone_nav.png` (1200×420, transparent). Favicon, JSON-LD `publisher.logo`, JSON-LD article `image`, and `og:image` use the square `images/livingstone_carre.png` (1080×1080). These are the only two logo files in the repo — older variants (`livingstone_logo_carre_1080.png`, `livingstone_logo_banniere_1920x1080.png`, the never-existed `livingstone-profil-facebook-720x720.png`) have been removed.
- Contact form posts to Formspree (`https://formspree.io/f/xqegldel`). Server-side handling lives there, not in this repo.
- YouTube embeds in the "Médias" section use `youtube-nocookie.com` — keep that domain when adding videos.
- The site serves **compressed web versions**: `images/bureau-web.jpg` (~236 KB) and `images/mikael-portrait-web.jpg` (~124 KB), both 2000 px wide / JPEG q80, referenced by `index.html`. The high-res originals `images/bureau.jpg` (~24 MB) and `images/mikael-portrait.jpg` (~15 MB) are kept as masters but **not served** — don't reference them from pages. If you add or replace photos, compress before committing (e.g. sharp: resize 2000 px, JPEG q80) — assets ship as-is to every visitor.
- `.gitignore` excludes `.claude/` and `*.txt` (local scratch). Don't commit either.
