# Summerhays Dance — Website Build Brief

Oct 27, 2026 · @Bryce

## Goal and audience

Build a warm, grown-up, mobile-first static marketing site, built in GitHub, that turns a visitor into a booked first class within two clicks. Brielle must be able to edit every word and photo herself through a simple browser editor (Pages CMS) after handoff.

**Business:** Summerhays Dance (working name; keep it in one config value so it can change). A rented-space studio in Utah teaching hip hop, jazz and contemporary to teens and adults. Positioning line: *for teens and adults who are serious about dancing, not about competing.*

Two audiences, two doors:

- **Adults 25–55 (beginners and former dancers) → the Dance Again program.** Mostly on phones, often parents, nervous about being "too old" or "out of shape." They need reassurance, a clear first step and a low-risk intro offer.
- **Teens 13–18 and their parents → the Teen Studio program (working name).** Parents decide and pay; they need schedule, price, safety policy and what makes it different from competition studios.

The site must: explain both programs in seconds, show the live schedule and prices, take bookings and payment through an embedded studio booking tool, capture email leads for the waitlist, and take inquiries for parties and private lessons.

Business context lives in the companion doc, *Summerhays Dance Studio — Viability & Business Plan*.

## Platform: GitHub

Build an Astro static site in a GitHub repo, deployed to GitHub Pages by a GitHub Actions workflow. Claude Code writes real code; Brielle edits text, prices and photos through Pages CMS, a free browser editor that saves her changes as commits.

### Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro, static output | Plain HTML and CSS output, built-in image optimization, content collections for editable data |
| Repo | GitHub, e.g. `summerhays-dance` | Source of truth; every change is a commit |
| Hosting | GitHub Pages via a GitHub Actions deploy workflow | Free, HTTPS, custom domain |
| Content editing | Pages CMS with a `.pages.yml` config | Free and open source, GitHub-only; Brielle edits forms in a browser, never YAML |
| Booking and payments | Embedded studio booking tool (Momence or OfferingTree) | A static host cannot take payments |
| Forms | A form service with a static endpoint, e.g. Formspree or Tally | GitHub Pages has no server |
| Email list | Free tier of an email tool, e.g. MailerLite or Kit | Waitlist and session announcements; confirm current free limits |

### GitHub Pages rules to design around

From GitHub Pages limits:

- Free GitHub accounts publish Pages only from public repos, so nothing secret ever goes in the repo.
- Published sites max out at 1 GB, with a soft 100 GB/month bandwidth limit and a 10-minute deploy timeout. Keep the hero video small.
- No server-side code. Everything interactive is client-side JavaScript or a third-party embed.
- GitHub says Pages is not meant to run an online business or a site mainly directed at commercial transactions. A marketing site that hands off to a separate booking tool is a gray area, so keep all checkout on the booking tool's own domain, and keep the build host-agnostic so the same repo can deploy to Cloudflare Pages or Netlify with no code changes if needed.

### Repo structure

```
summerhays-dance/
├─ .github/workflows/deploy.yml   # build Astro, deploy to Pages
├─ .pages.yml                     # Pages CMS: what Brielle can edit
├─ astro.config.mjs
├─ public/                        # favicon, CNAME, robots.txt, social image
├─ src/
│  ├─ content/                    # ALL editable content
│  │  ├─ site.yaml                # name, contact, socials, booking URL, prelaunch flag
│  │  ├─ programs/                # dance-again.md, teens.md
│  │  ├─ schedule/                # one file per class in the preview table
│  │  ├─ pricing/                 # one file per price card
│  │  ├─ faqs/                    # one file per question
│  │  └─ testimonials/            # one file per quote
│  ├─ components/                 # one .astro file per design-system component
│  ├─ layouts/Base.astro
│  ├─ pages/                      # one file per sitemap page
│  └─ styles/tokens.css           # color, type and spacing custom properties
└─ README.md                      # run, edit, deploy
```

Repeatable content (classes, prices, FAQs, testimonials) is one small file per item, because Pages CMS edits folders of files cleanly and reviewers note it lacks repeater fields.

### Workflow

1. Bryce creates the GitHub repo and clones it; Claude Code scaffolds Astro inside it.
2. `npm run dev` for local preview; Claude Code checks every page at 375, 768 and 1280 px wide.
3. Add the Astro GitHub Pages deploy workflow and set the repo's Pages source to GitHub Actions.
4. Custom domain: `public/CNAME` with the domain, DNS records at the registrar, then enforce HTTPS.
5. Connect Pages CMS to the repo, define collections in `.pages.yml`, and test one edit end to end: Brielle saves, the commit lands, the site redeploys.

### Build rules

- No copy, prices, schedule rows or photos hard-coded in components; everything renders from `src/content`.
- Hand-written CSS with custom properties, no CSS framework. Vanilla JavaScript only; no client-side framework islands.
- Images through Astro's `<Image>` component for responsive sizes and modern formats.
- No API keys or secrets anywhere in the repo.

## Sitemap

Ten pages, with "Book your first class" as the site-wide primary action.

| Page | URL | Purpose | Primary CTA |
|---|---|---|---|
| Home | `/` | Two clear doors (adults, teens), intro offer, proof | Book your first class |
| Dance Again | `/dance-again` | Adult program: story, levels, cohort format, schedule snippet | Claim the intro offer |
| Teen Studio | `/teens` | Teen program for students and parents: format, safety, trial | Book a trial class |
| Schedule & Pricing | `/schedule` | Live booking embed plus pricing table | Book (inside embed) |
| Your First Class | `/first-class` | What to expect, what to wear, parking, FAQ | Claim the intro offer |
| About Brielle | `/about` | Her story, training, why she teaches | Dance with Brielle |
| Parties & Privates | `/parties` | Bachelorettes, birthdays, private lessons | Send an inquiry |
| Waitlist | `/waitlist` | Pre-launch landing page; becomes "join the email list" after launch | Join the waitlist |
| Contact | `/contact` | Form, email, social links, where classes meet | Send a message |
| Policies | `/policies` | Cancellations, waivers, minors' safety policy, privacy | — |

**Header:** logo · Dance Again · Teens · Schedule & Pricing · About · a solid **Book a class** button. On mobile: logo, Book button and a menu icon.

**Footer:** short positioning line, links to First Class, Parties, Contact and Policies, social icons, and an inline email signup form.

**Pre-launch mode:** until classes open, a `prelaunch` flag in `site.yaml` swaps every "Book" button to "Join the waitlist" pointing to `/waitlist`, and hides the schedule embed.

## Design system

Warm, confident and grown-up: closer to Ailey Extension than to a kids' recital studio, with Dance Church's booking clarity and STEEZY's level-picker cards. One signature color, real photography, generous space.

### Color (custom properties in `tokens.css`)

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FAF6F1` | Page background |
| `--ink` | `#182224` | Body text, headlines |
| `--muted` | `#566467` | Secondary text |
| `--teal` | `#0B6B78` | Brand color: buttons, links, highlights |
| `--teal-deep` | `#06434D` | Hover states, dark bands, intro-offer bar |
| `--mist` | `#E2F1F2` | Tinted section backgrounds |
| `--sand` | `#EADFD2` | Alternate section backgrounds, card borders |

Teal is the only accent. Text on teal is cream. Check every pairing for WCAG AA contrast.

### Type (Google Fonts)

- **Display:** Anton, uppercase, line-height 0.95. Hero `clamp(2.75rem, 7vw, 6rem)`; H2 `clamp(2rem, 4.5vw, 3.5rem)`.
- **Body:** DM Sans 400/500/700, 18px base on desktop and 17px on mobile, line-height 1.6.
- **Eyebrows and labels:** DM Sans 600, 13px, uppercase, 0.12em letter-spacing.

### Layout and shape

8px spacing scale; section padding 96px desktop and 64px mobile; content max-width 1200px; 20px side gutters on mobile; no horizontal scroll. Cards have a 16px radius; buttons are pills (fully rounded), 48px tall minimum.

### Components to build as Astro components

1. **Intro-offer bar:** slim teal-deep strip above the header ("New here? 2 classes in 3 weeks for $25"); text, link and on/off are fields.
2. **Header:** sticky; transparent over the hero, solid cream after scroll; Book button always visible.
3. **Hero:** full-bleed video or image, headline, subline, primary and secondary buttons; visible pause button for video.
4. **Two doors:** two large photo cards, "For adults → Dance Again" and "For teens → Teen Studio."
5. **Level picker:** three cards in plain language ("I danced years ago and miss it," "I've taken a few classes," "I want to perform again"), each linking to the right cohort.
6. **Style tiles:** hip hop, jazz, contemporary; photo, one line each.
7. **Schedule preview:** static table (day, time, class, level, location, Book) for marketing pages; the live schedule lives in the booking embed.
8. **Pricing cards:** intro offer highlighted, then drop-in, 8-week cohorts, teen session.
9. **Testimonials:** static grid of 2–3 quotes with name and program. No auto-rotating carousels.
10. **Instructor block:** portrait, short bio, credential list.
11. **FAQ accordion:** native `details` and `summary`.
12. **Email signup band and inquiry form:** wrappers around the form-service and email-list embeds.
13. **Footer.**

### Imagery and motion

Real photos of real students only, never stock dancers. Until the shoot, use neutral sand-colored placeholder blocks labeled with the photo needed (e.g. "PHOTO: adults mid-turn, laughing"). Hero video: 10–20 second muted loop, `autoplay muted loop playsinline`, MP4 under 6 MB with a poster image. Motion is limited to a subtle fade-up on scroll (under 200 ms), fully disabled under `prefers-reduced-motion`. No parallax, no scroll-jacking.

## Page-by-page specs

Sections listed top to bottom. Copy in quotes is starter copy; Brielle will refine it.

### Home `/`

1. Intro-offer bar
2. Hero: video loop of a class; headline "Come dance again."; subline "Hip hop, jazz and contemporary for teens and adults in [City], Utah. Serious about dancing, not about competing."; buttons "Book your first class" and "See the schedule"
3. Two doors: Dance Again (adults) and Teen Studio
4. Style tiles: hip hop, jazz, contemporary
5. How it works: three steps (Try a class → Join an 8-week session → Perform at the showcase)
6. Meet Brielle: portrait, two-sentence bio, link to About
7. Testimonials (hidden until real quotes exist)
8. Email signup band: "Get first dibs on new sessions"

### Dance Again `/dance-again`

1. Hero: "You used to dance. You still can."
2. Who it's for: beginners, former studio kids, parents; "no dance experience required" vs. "rusty welcome"
3. Level picker: Returning Beginner, Intermediate, Performance
4. How sessions work: 8 weeks, one class a week, showcase at the end, one makeup week
5. Schedule preview filtered to adult classes
6. Pricing snippet with intro offer highlighted
7. FAQ subset (age, fitness, what to wear)
8. Final CTA band

### Teen Studio `/teens`

1. Hero: "Real training. No competition circuit."
2. What makes it different: small groups, technique first, one performance per session, no costume fees
3. For parents: schedule, price, trial-class process, safety policy summary linking to Policies
4. Schedule preview filtered to teen classes
5. CTA: "Book a trial class"

### Schedule & Pricing `/schedule`

Booking-tool embed at full width (live classes, booking, payment), with a fallback "Open the schedule" link to the booking tool's own page. Below it, pricing cards from `pricing/`. Hidden in prelaunch mode and replaced by the waitlist form.

### Your First Class `/first-class`

What to expect minute by minute, what to wear and bring, shoes, parking and arrival, accessibility notes, then the full FAQ and the intro-offer CTA.

### About Brielle `/about`

Large portrait, her dance story, training and teaching history, why she started Summerhays Dance, studio values (effort over perfection, every body belongs, family-friendly music), CTA.

### Parties & Privates `/parties`

Three cards (bachelorette or girls' night, birthday group, private lesson) with starting prices, then the inquiry form: name, email, phone, event type, preferred dates, group size, notes.

### Waitlist `/waitlist`

Minimal page: one headline, one sentence, email signup with first name and "I'm interested in" (Dance Again, Teen Studio, both).

### Contact `/contact`

Contact form, email address, social links, and where classes meet (by area until a permanent address exists).

### Policies `/policies`

Cancellation and makeup policy, waiver note, minors' safety policy, privacy policy. Plain text, anchored headings.

## Integrations

Everything that needs a server lives in a third-party embed; the site itself stays pure static HTML.

| Need | Approach | Notes for Claude Code |
|---|---|---|
| Class schedule, booking, payments | Booking tool's embed script or iframe in a `BookingEmbed` component | Embed code and fallback URL come from `site.yaml`; lazy-load below the fold; never build custom checkout |
| Inquiry and contact forms | Form service endpoint (Formspree or Tally) | Form action URL from `site.yaml`; honeypot field for spam; thank-you state without a page reload |
| Email list and waitlist | Email tool's embedded signup | Fields: first name, email, interest (Dance Again, Teen Studio, both) |
| SEO | Astro layout handles meta | Unique title and description per page; Open Graph image; `sitemap.xml` via the Astro sitemap integration; `robots.txt`; LocalBusiness JSON-LD on Home with name, area served and social profiles |
| Analytics | Privacy-friendly, cookie-free analytics (e.g. Plausible or Cloudflare Web Analytics) | Script tag controlled by a `site.yaml` value; off by default |
| Social | Plain icon links | No Instagram feed widget; they slow pages and break |
| Google Business Profile | Set up outside the site | Name, area and site URL must match the JSON-LD exactly |

**Prelaunch flag:** when `prelaunch: true` in `site.yaml`, every Book button points to `/waitlist`, the intro-offer bar reads "Classes open soon: join the waitlist," and the booking embed is hidden.

## Content Brielle must supply

Claude Code builds with clearly marked placeholders; these are what replace them. Nothing here blocks starting the build.

- Final business name and teen program name
- Logo (or approval to start with a wordmark in Anton)
- City or area where classes meet, plus contact email and phone
- Her bio: dance training, teaching history, why she teaches (300–400 words)
- Professional photos and a 10–20 second hero clip from a pilot class
- Final prices and the intro offer
- First session schedule (days, times, levels, locations)
- Booking tool account and its embed code
- Form service and email tool accounts, with their form URLs
- Policies text: cancellations, makeups, minors' safety, privacy
- Two or three real testimonials after the pilot
- Domain name and registrar login (Bryce sets the DNS)

## Build steps and acceptance checklist

Build in six passes, with Bryce reviewing the local preview at the end of each.

1. **Scaffold:** Astro project, repo structure above, `tokens.css`, `Base.astro` layout, header, footer, intro-offer bar, deploy workflow. Push and confirm the empty site is live on GitHub Pages.
2. **Content layer:** content collections with schemas for `site.yaml`, programs, schedule, pricing, FAQs and testimonials, filled with placeholder data.
3. **Components:** every design-system component, built once and rendered on a hidden `/styleguide` page (excluded from the sitemap) for review.
4. **Pages:** all ten pages assembled from components and content.
5. **Integrations:** booking embed, forms, email signup, SEO, prelaunch flag.
6. **Editing and handoff:** `.pages.yml` for Pages CMS, a one-page "How to edit your site" guide for Brielle in `README.md`, custom domain and HTTPS.

### Done means

- Every page works at 375, 768 and 1280 px with no horizontal scroll
- Lighthouse mobile: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+
- WCAG 2.2 AA: color contrast, visible focus states, full keyboard navigation, alt text on every image, 44 px minimum tap targets, video pause control
- Animations off under `prefers-reduced-motion`
- No copy, prices or photos hard-coded in components
- Prelaunch flag flips the whole site between waitlist and booking modes
- A test form submission and a test email signup both arrive
- Brielle changes a price in Pages CMS and sees it live within a few minutes
- Same build deploys to Cloudflare Pages or Netlify without code changes
- No secrets in the repo; README covers run, edit and deploy

## Kickoff prompt for Claude Code

> You're building the website for Summerhays Dance, a Utah dance studio for teens and adults. The full spec is in BRIEF.md in this repo. Read all of it before writing any code, and treat it as the source of truth.
>
> Stack: Astro (static output), deployed to GitHub Pages with GitHub Actions, content edited through Pages CMS. Hand-written CSS with custom properties, vanilla JS, no CSS or JS frameworks.
>
> Work in the six passes listed under "Build steps". After each pass:
> - run the dev server and check every page at 375, 768 and 1280 px,
> - commit with a clear message,
> - stop and give me a short summary of what changed and what you need from me.
>
> Rules:
> - All copy, prices, schedule rows, FAQs and photos come from src/content. Nothing hard-coded in components.
> - Use labeled placeholder blocks where real photos are missing.
> - Never put API keys or secrets in the repo; it is public.
> - Ask before adding any dependency not named in BRIEF.md.
> - Never build custom checkout or payments; booking is an embed.
>
> Start with pass 1 (Scaffold).
