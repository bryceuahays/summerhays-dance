# Summerhays Dance website

Marketing site for Summerhays Dance: hip hop, jazz and contemporary for teens and adults in Utah. Built with [Astro](https://astro.build) as a plain static site and deployed to GitHub Pages. The full spec is in [BRIEF.md](BRIEF.md).

---

## How to edit your site (for Brielle)

You edit everything in **Pages CMS**, a website that edits this site for you. You never touch code.

### Sign in

1. Go to **[app.pagescms.org](https://app.pagescms.org)** and choose **Sign in with GitHub**.
2. Pick **summerhays-dance**.
3. The menu on the left lists everything you can change: **Site settings**, **Classes**, **Prices**, **FAQs**, **Testimonials**, **Programs**, and one **Page:** entry per page.

### How saving works

- Click **Save**. Your change is live on the site in **about two minutes**.
- You can't break the site. If something is entered in a way the site can't use (say, a time typed as `7pm`), the update simply doesn't go out and the last good version stays live. If a change hasn't appeared after five minutes, double-check what you typed, or ask Bryce to look.
- Anything in **[square brackets]** is placeholder text waiting for your real details.

### Common jobs

| To do this | Go to | Then |
|---|---|---|
| Change a price | **Prices** → the card | Change **Price (dollars)**, Save |
| Add a class | **Classes** → **Add an entry** | Fill in every field. Times look like `6:30 PM` |
| Change or remove a class | **Classes** → the class | Edit and Save, or **Delete** |
| Open booking on launch day | **Site settings** | Fill in **Booking tool** (page address and embed code), then turn **Prelaunch mode** off |
| Add a photo | The item with the photo (a program card, the About portrait, a style tile…) | Under **Photo**, upload the **Image**, and always fill in **Photo description** |
| Show a testimonial | **Testimonials** → the quote | Turn on **Show on the site** (only once the dancer has said yes) |
| Add or edit a question | **FAQs** | Tick the **Topics** so it shows on the right program page |
| Change the offer bar at the top | **Site settings** → **Intro-offer bar** | Edit the text, or untick **Show the bar** |
| Change any page's wording | **Page: …** (e.g. **Page: About Brielle**) | Edit and Save |
| Update your bio | **Page: About Brielle** | **Short bio** shows on Home too; **Her story** is the long version |
| Update policies | **Page: Policies** | Each policy is a **Heading 2**; change **Last updated** |

### Photo tips

- Use real photos of real classes. Landscape works best for wide spots; the site crops and resizes for phones automatically.
- JPG or PNG straight from a phone is fine.
- Until a photo is added, the site shows a sand-colored box labeled with the photo it needs. The **Photo description** is that label, and it is also what screen readers read aloud.
- The background video on the home page needs a file uploaded by Bryce.

---

## Setup notes (for Bryce)

### Give Brielle editing access

1. On GitHub, open the repo → **Settings** → **Collaborators** → **Add people**, and invite Brielle's GitHub account.
2. She accepts the invite, then signs in at [app.pagescms.org](https://app.pagescms.org). The first time, Pages CMS asks to install its GitHub app on the repo; approve it for **summerhays-dance** only.
3. The editor's fields are defined in [.pages.yml](.pages.yml). Photos upload to `src/assets/images` and are written in content as `@images/name.jpg`.

### Hero video

Put the MP4 (10 to 20 seconds, under 6 MB, muted loop) in `public/video/`, then set **Page: Home → Top of the page → Background video** to `/video/your-file.mp4`. The hero photo is its poster.

### Connect the booking tool, forms and email list

All in **Site settings** (or `src/content/site.yaml`):

- **Booking tool:** the booking tool's schedule page address, and its embed code pasted as given.
- **Form addresses:** a Formspree form address (like `https://formspree.io/f/abcdwxyz`) for the contact form and for the party inquiry form, and the email tool's form address for signups. Set **Field names the email tool expects** to match it (Kit: `first_name`, `email_address`; Mailchimp: `FNAME`, `EMAIL`).
- Until these are filled in, forms show the "something went wrong, email us directly" message.

### Custom domain and HTTPS

The build adapts on its own once the domain is set: links drop the `/summerhays-dance` prefix and the sitemap uses the new address.

1. **Buy the domain** at any registrar.
2. **Verify it with GitHub** (stops anyone else claiming it): your GitHub profile → **Settings** → **Pages** → **Add a domain**, then add the TXT record it shows at the registrar and click **Verify**.
3. **Point the domain at GitHub** in the registrar's DNS settings:
   - Four **A** records for the bare domain (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Optional **AAAA** records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - One **CNAME** record: `www` → `bryceuahays.github.io`
4. **Tell GitHub the domain:** repo → **Settings** → **Pages** → **Custom domain**, type the domain, **Save**, and wait for the DNS check to pass (minutes to a few hours).
5. **Turn on HTTPS:** tick **Enforce HTTPS** on the same page once GitHub offers it (the certificate can take up to a day).
6. **Rebuild once:** repo → **Actions** → **Deploy to GitHub Pages** → **Run workflow**.
7. **Update the places that name the address:** the Google Business Profile website link, and the analytics domain if analytics is on. The business name and area in the Google profile must match **Site settings** exactly.

No `CNAME` file is needed; with a GitHub Actions deploy, the domain lives in the repo settings.

---

## For developers

### Run it on your computer

Needs Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321. On Windows PowerShell, type `npm.cmd` in place of `npm`.

### Where things live

- `src/content/site.yaml`: business name, contact details, the prelaunch switch, the intro offer, menus, email signup wording, social links, booking and form addresses, analytics.
- `src/content/programs/`: Dance Again and Teen Studio, one file each.
- `src/content/schedule/`: one file per weekly class.
- `src/content/pricing/`: one file per price card (classes, parties and privates).
- `src/content/faqs/`: one file per question, tagged by topic.
- `src/content/testimonials/`: one file per quote; only those marked `published: true` show.
- `src/content/pages/`: each page's own wording, one file per page.
- `src/content.config.ts`: the rules each content file must follow. A typo stops the build with a clear message instead of publishing a broken page.
- `.pages.yml`: the Pages CMS editor's fields, mirroring `src/content`.
- `src/styles/tokens.css`: colors, fonts and spacing.
- `src/components/`: one file per piece of the design system, all shown on the hidden `/styleguide` page.
- `src/layouts/`: the page shell (`Base.astro`) and the shared program page layout.
- `src/pages/`: one file per page.
- `src/scripts/`: header, menu, fade-in, hero video and form sending.

All the words come from `src/content`, never from the components.

### Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repo's **Settings → Pages**, the source must be **GitHub Actions**.

The build reads two optional settings from the host:

- `SITE_URL`: the full address of the site (the workflow fills it in; Netlify and Cloudflare Pages are detected automatically).
- `BASE_PATH`: the folder the site lives under, e.g. `/summerhays-dance` before a custom domain. Empty once the custom domain is live.

So the same code deploys unchanged to Netlify or Cloudflare Pages: build command `npm run build`, output folder `dist`.

### Rules

The repo is public. Never commit passwords, API keys or tokens. Booking embed codes and form addresses are public by design and fine to commit.
