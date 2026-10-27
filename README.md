# Summerhays Dance website

Marketing site for Summerhays Dance: hip hop, jazz and contemporary for teens and adults in Utah. Built with [Astro](https://astro.build) as a plain static site and deployed to GitHub Pages. The full spec is in [BRIEF.md](BRIEF.md).

> Status: pass 1 of 6 (scaffold). Brielle's "How to edit your site" guide is added in pass 6.

## Run it on your computer

Needs Node.js 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:4321. On Windows PowerShell, type `npm.cmd` in place of `npm`.

## Where things live

- `src/content/site.yaml`: business name, contact details, the prelaunch switch, the intro offer, menus, social links, booking and form addresses. All the words come from `src/content`, never from the components.
- `src/styles/tokens.css`: colors, fonts and spacing.
- `src/components/`: one file per piece of the design system.
- `src/layouts/Base.astro`: the page shell (head tags, offer bar, header, footer).
- `src/pages/`: one file per page.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repo's **Settings → Pages**, the source must be set to **GitHub Actions**.

The build reads two optional settings from the host:

- `SITE_URL`: the full address of the site (the workflow fills it in; Netlify and Cloudflare Pages are detected automatically).
- `BASE_PATH`: the folder the site lives under, e.g. `/summerhays-dance` before a custom domain is set up. Empty once the custom domain is live.

So the same code deploys unchanged to Netlify or Cloudflare Pages: build command `npm run build`, output folder `dist`.

## Rules

The repo is public. Never commit passwords, API keys or tokens.
