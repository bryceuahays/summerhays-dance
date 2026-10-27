import { getCollection, getEntry, type CollectionEntry, type DataEntryMap } from 'astro:content';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** "6:30 PM" → minutes after midnight, for sorting. */
function minutes(time: string) {
  const [, h, m, ampm] = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i) ?? [];
  return ((Number(h) % 12) + (ampm?.toUpperCase() === 'PM' ? 12 : 0)) * 60 + Number(m);
}

/** A page's own copy, e.g. getPage('home') reads src/content/pages/home.yaml. */
export async function getPage<C extends keyof DataEntryMap>(collection: C) {
  const entries = await getCollection(collection);
  if (!entries[0]) throw new Error(`No content file for the "${String(collection)}" page`);
  return entries[0] as CollectionEntry<C>;
}

export async function getProgram(id: string) {
  const program = await getEntry('programs', id);
  if (!program) throw new Error(`No program file src/content/programs/${id}.md`);
  return program;
}

/** Classes in week order (Monday first), optionally for one program. */
export async function getSchedule(programId?: string) {
  const classes = await getCollection(
    'schedule',
    (c) => !programId || c.data.program.id === programId,
  );
  return classes.sort(
    (a, b) =>
      DAYS.indexOf(a.data.day) - DAYS.indexOf(b.data.day) ||
      minutes(a.data.startTime) - minutes(b.data.startTime),
  );
}

/**
 * Price cards for one group, in order. With a program, keeps that program's
 * cards plus the ones for every program (like the intro offer).
 */
export async function getPricing(group: 'classes' | 'parties', programId?: string) {
  const cards = await getCollection(
    'pricing',
    (p) =>
      p.data.group === group &&
      (!programId || !p.data.program || p.data.program.id === programId),
  );
  return cards.sort((a, b) => a.data.order - b.data.order);
}

/** FAQs in order; with topics, only questions tagged with at least one of them. */
export async function getFaqs(topics?: string[]) {
  const faqs = await getCollection(
    'faqs',
    (f) => !topics?.length || f.data.topics.some((t) => topics.includes(t)),
  );
  return faqs.sort((a, b) => a.data.order - b.data.order);
}

/** Only quotes marked published; the section hides itself when there are none. */
export async function getTestimonials() {
  const quotes = await getCollection('testimonials', (t) => t.data.published);
  return quotes.sort((a, b) => a.data.order - b.data.order);
}

export function formatPrice(price: number) {
  return `$${Number.isInteger(price) ? price : price.toFixed(2)}`;
}
