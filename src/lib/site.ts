import { getEntry } from 'astro:content';

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/content/site.yaml is missing');
  return entry.data;
}

export type Site = Awaited<ReturnType<typeof getSite>>;

/** Prefix a site path with the deploy base (e.g. /summerhays-dance on GitHub Pages). */
export function url(path: string) {
  if (/^([a-z]+:|#|\/\/)/i.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Where every "Book" button goes: the waitlist before launch, the schedule after. */
export function bookAction(site: Site) {
  return site.prelaunch
    ? { href: url('/waitlist'), label: site.waitlistLabel }
    : { href: url('/schedule'), label: site.bookLabel };
}
