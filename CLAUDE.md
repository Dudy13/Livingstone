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
- The hidden form fields `_subject` ("Cas pratique - <titre>") and `source` ("/cas-pratiques/<slug>") in the bottom CTA so Formspree submissions are attributable
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

Formspree remains the transport **until Brevo is connected**. It delivers, it does not
sequence — the nurturing sequence in `docs/sequence-emails-cession.md` only pays off
once it runs in an emailing tool.

**Switching to Brevo is one line.** `analytics.js` holds `LV_BREVO_FORM`, empty by
default. Paste the hosted form's `action=` URL (`https://sibforms.com/serve/…`) and, at
load, every `form[data-lv-brevo]` is retargeted and its fields renamed to the Brevo
convention (`prenom`→`PRENOM`, `telephone`→`SMS`, `source`→`SOURCE`, …), with the
`email_address_check` honeypot and `locale` added. `_subject` and `_next` are dropped —
Brevo owns the redirect, set to `/merci-guide` in the form's own settings.

The attribute names are a **contract**: they must exist in Brevo exactly as
`docs/brevo-mise-en-route.md` lists them, or contacts land with empty fields and
nothing reports it. That document is the click-by-click setup path.

Three documents, three jobs, do not merge them: `docs/sequence-emails-cession.md`
is the editorial source (why the sequence exists, what each email argues),
`docs/brevo-sequence-a-coller.md` is its operational form (the same six emails with
Brevo merge tags and real URLs, plus the automation table, ready to paste), and
`docs/brevo-mise-en-route.md` covers the account setup that precedes both. When an
email's wording changes, change it in the first two or in neither.

Three traps the integration already handles — do not undo them:

1. **The URL must be the `/serve/` one, not `/v2/serve/`.** Brevo's iframe share
   gives the `v2` variant, which only *renders* the form. The POST endpoint is in
   the HTML embed's `action=`.
2. **The phone never goes into Brevo's `SMS` attribute.** That attribute enforces a
   strict format *and* uniqueness across the whole base, and Brevo rejects the entire
   submission when either fails — losing a lead over a field that was never required.
   Two prospects sharing a switchboard is enough to trigger it
   (`{"success":false,"errors":{"SMS":"Le numéro de téléphone est déjà lié à un compte
   existant."}}`). It is mapped to **`TELEPHONE`, a plain text attribute**: no format,
   no uniqueness, no rejection. Sent exactly as the visitor typed it, which is also what
   Mikael reads when he dials. **Do not map it back to `SMS`** — the cost is losing SMS
   campaigns from Brevo, which is not part of the plan.
3. **The consent checkbox must carry the value `1`**, not `oui` — Brevo's optin
   block expects it.

One trap worth repeating: switching to Brevo **loses the Formspree notification email**.
The Brevo automation that notifies Mikael on every new contact has to exist first, or
leads arrive unnoticed.

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

Under the standard footer links sits a `.footer-compliance` block, generated from one
definition and identical on all 21 pages. It carries, in this order:

1. SARL identifiers — capital, RCS Paris 951 716 349, **code APE 6619B**, address, and
   the **mobile 07 78 51 13 07** (the number Mikael answers; the landline is not exposed);
2. ORIAS 23007478, **LA COMPAGNIE CIF** (CIF association, AMF), **LA CNCEF** (broking
   association, ACPR), and the professional indemnity policy — **Assurup, contract
   RCP23051083028**;
3. **« Ne peut recevoir aucun fonds, effet, ou valeur. »** — required of a broker with no
   collection mandate. Do not drop it.

The authoritative wording is the legal signature block supplied by Mikael Guéviguian,
also reproduced in `docs/sequence-emails-cession.md` for email footers. Site and emails
must not diverge: change both or neither.

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
- **No em dashes in copy.** The site carries none: `—` reads as machine-written and the
  founder's name is on every page. Use a colon for an explanation, a comma for an
  apposition, parentheses for an accessory enumeration, or a full stop when the idea
  stands alone. Two deliberate exceptions: the `.negatif` list bullet in `refonte.css`
  (`content:"—"`, a typographic glyph, not prose) and the verbatim legal signature block
  in `docs/sequence-emails-cession.md`, supplied as-is by Mikael Guéviguian.
- `.gitignore` excludes `.claude/` and `*.txt` (local scratch). Don't commit either.
