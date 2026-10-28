import { defineCollection, reference } from 'astro:content';
import type { SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Everything Brielle can edit lives in src/content. Repeatable things
// (classes, prices, FAQs, quotes) are one small file each so Pages CMS can
// edit them as a folder; each page's own copy is a single file in pages/.

type Image = SchemaContext['image'];

const link = z.object({ label: z.string(), href: z.string() });

/** A photo; until the shoot, `src` is empty and `alt` labels the placeholder block. */
const photo = (image: Image) =>
  z.object({
    src: image().optional(),
    alt: z.string(),
  });

/** A heading with a list of short titled points (who it's for, how it works, etc.). */
const pointList = z.object({
  heading: z.string(),
  intro: z.string().optional(),
  items: z.array(z.object({ title: z.string(), text: z.string() })),
});

const ctaBand = z.object({
  heading: z.string(),
  text: z.string().optional(),
  buttonLabel: z.string(),
});

const hero = (image: Image) =>
  z.object({
    eyebrow: z.string().optional(),
    headline: z.string(),
    subline: z.string(),
    primaryLabel: z.string(),
    secondary: link.optional(),
    photo: photo(image),
    /** Optional MP4 in public/video (under 6 MB, 10-20 seconds). The photo is its poster. */
    video: z.string().optional(),
  });

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const clockTime = z
  .string()
  .regex(/^(1[0-2]|[1-9]):[0-5]\d\s?(AM|PM)$/i, 'Use a time like 6:30 PM');

const formField = z.object({ label: z.string(), hint: z.string().optional() });

/** Each page keeps its own copy in one file, e.g. src/content/pages/home.yaml. */
const pageFile = (name: string) => glob({ pattern: `${name}.{yaml,md}`, base: './src/content/pages' });

const pageMeta = {
  title: z.string(),
  description: z.string(),
};

// ---------------------------------------------------------------- site-wide

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      instructorName: z.string(),
      positioning: z.string(),
      description: z.string(),
      city: z.string(),
      state: z.string(),
      email: z.string(),
      phone: z.string().default(''),
      socialImage: image().optional(),
      prelaunch: z.boolean(),
      bookLabel: z.string(),
      waitlistLabel: z.string(),
      introOffer: z.object({
        enabled: z.boolean(),
        text: z.string(),
        linkText: z.string(),
        prelaunchText: z.string(),
        prelaunchLinkText: z.string(),
      }),
      nav: z.array(link),
      footerLinks: z.array(link),
      signup: z.object({
        heading: z.string(),
        text: z.string(),
        firstNameLabel: z.string(),
        emailLabel: z.string(),
        interestLabel: z.string(),
        interestOptions: z.array(z.string()).min(1),
        buttonLabel: z.string(),
        note: z.string().default(''),
        successMessage: z.string(),
      }),
      formErrorMessage: z.string(),
      /** Small interface wording: screen-reader labels, table headings, buttons. */
      ui: z.object({
        skipLink: z.string(),
        menu: z.string(),
        mainNavLabel: z.string(),
        footerNavLabel: z.string(),
        photoLabel: z.string(),
        pauseVideo: z.string(),
        playVideo: z.string(),
        bookClass: z.string(),
        honeypot: z.string(),
        scheduleColumns: z.object({
          day: z.string(),
          time: z.string(),
          className: z.string(),
          level: z.string(),
          location: z.string(),
          book: z.string(),
        }),
      }),
      social: z.object({
        instagram: z.string().default(''),
        tiktok: z.string().default(''),
        facebook: z.string().default(''),
        youtube: z.string().default(''),
      }),
      booking: z.object({
        url: z.string().default(''),
        embedCode: z.string().default(''),
      }),
      forms: z.object({
        contactAction: z.string().default(''),
        inquiryAction: z.string().default(''),
        emailSignupAction: z.string().default(''),
        /** Field names the email tool expects, e.g. Kit uses email_address and first_name. */
        signupFieldNames: z
          .object({
            firstName: z.string().default('firstName'),
            email: z.string().default('email'),
            interest: z.string().default('interest'),
          })
          .default({ firstName: 'firstName', email: 'email', interest: 'interest' }),
      }),
      analytics: z.object({
        enabled: z.boolean().default(false),
        scriptSrc: z.string().default(''),
        dataDomain: z.string().default(''),
        /** Cloudflare Web Analytics token, if using Cloudflare instead of Plausible. */
        cloudflareToken: z.string().default(''),
      }),
    }),
});

// --------------------------------------------------------------- repeatables

const programs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/programs' }),
  schema: ({ image }) =>
    z.object({
      ...pageMeta,
      name: z.string(),
      audience: z.string(),
      door: z.object({
        eyebrow: z.string(),
        text: z.string(),
        linkLabel: z.string(),
        photo: photo(image),
      }),
      hero: hero(image),
      whoFor: pointList.optional(),
      levels: z
        .object({
          heading: z.string(),
          intro: z.string().optional(),
          items: z.array(
            z.object({
              name: z.string(),
              prompt: z.string(),
              text: z.string(),
            }),
          ),
        })
        .optional(),
      sessionFormat: pointList.optional(),
      different: pointList.optional(),
      parents: pointList
        .extend({ policyLinkLabel: z.string() })
        .optional(),
      schedule: z.object({ heading: z.string(), intro: z.string().optional() }),
      pricing: z.object({ heading: z.string(), intro: z.string().optional() }).optional(),
      faq: z
        .object({ heading: z.string(), topics: z.array(z.string()).min(1) })
        .optional(),
      cta: ctaBand,
    }),
});

const schedule = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/schedule' }),
  schema: z.object({
    program: reference('programs'),
    day: z.enum(days),
    startTime: clockTime,
    endTime: clockTime,
    className: z.string(),
    level: z.string(),
    location: z.string(),
    /** Direct booking link for this class; falls back to the main booking page. */
    bookingUrl: z.string().default(''),
  }),
});

const pricing = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/pricing' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      group: z.enum(['classes', 'parties']),
      /** Leave empty for "every program". */
      program: reference('programs').optional(),
      pricePrefix: z.string().default(''),
      price: z.number().nonnegative(),
      priceSuffix: z.string().default(''),
      summary: z.string(),
      includes: z.array(z.string()).default([]),
      highlight: z.boolean().default(false),
      badge: z.string().default(''),
      photo: photo(image).optional(),
      order: z.number().default(0),
    }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    topics: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    name: z.string(),
    program: reference('programs'),
    /** Keep off until the quote is real and the dancer has said yes. */
    published: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

// --------------------------------------------------------------------- pages

const home = defineCollection({
  loader: pageFile('home'),
  schema: ({ image }) =>
    z.object({
      description: z.string(),
      hero: hero(image),
      doors: z.object({ heading: z.string() }),
      styles: z.object({
        heading: z.string(),
        items: z.array(z.object({ name: z.string(), text: z.string(), photo: photo(image) })),
      }),
      howItWorks: pointList,
      meetInstructor: z.object({
        eyebrow: z.string(),
        heading: z.string(),
        linkLabel: z.string(),
      }),
      testimonials: z.object({ heading: z.string() }),
    }),
});

const schedulePage = defineCollection({
  loader: pageFile('schedule'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    intro: z.string(),
    fallbackLinkLabel: z.string(),
    pricingHeading: z.string(),
    pricingIntro: z.string().optional(),
    prelaunch: z.object({ heading: z.string(), text: z.string() }),
  }),
});

const firstClass = defineCollection({
  loader: pageFile('first-class'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    intro: z.string(),
    timeline: z.object({
      heading: z.string(),
      items: z.array(z.object({ time: z.string(), title: z.string(), text: z.string() })),
    }),
    wear: pointList,
    arrival: pointList,
    accessibility: z.object({ heading: z.string(), text: z.string() }),
    faqHeading: z.string(),
    cta: ctaBand,
  }),
});

const about = defineCollection({
  loader: pageFile('about'),
  schema: ({ image }) =>
    z.object({
      ...pageMeta,
      heading: z.string(),
      portrait: photo(image),
      shortBio: z.string(),
      credentials: z.object({ heading: z.string(), items: z.array(z.string()) }),
      values: pointList,
      cta: ctaBand,
    }),
});

const parties = defineCollection({
  loader: pageFile('parties'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    intro: z.string(),
    form: z.object({
      heading: z.string(),
      intro: z.string().optional(),
      name: formField,
      email: formField,
      phone: formField,
      eventType: formField.extend({ options: z.array(z.string()).min(1) }),
      dates: formField,
      groupSize: formField,
      notes: formField,
      submitLabel: z.string(),
      successMessage: z.string(),
    }),
  }),
});

const waitlist = defineCollection({
  loader: pageFile('waitlist'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    text: z.string(),
    launchedHeading: z.string(),
    launchedText: z.string(),
  }),
});

const contact = defineCollection({
  loader: pageFile('contact'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    intro: z.string(),
    form: z.object({
      heading: z.string(),
      name: formField,
      email: formField,
      message: formField,
      submitLabel: z.string(),
      successMessage: z.string(),
    }),
    details: z.object({
      heading: z.string(),
      emailLabel: z.string(),
      phoneLabel: z.string(),
      socialLabel: z.string(),
    }),
    where: z.object({ heading: z.string(), text: z.string() }),
  }),
});

const policies = defineCollection({
  loader: pageFile('policies'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    intro: z.string(),
    updated: z.string(),
  }),
});

const notFound = defineCollection({
  loader: pageFile('not-found'),
  schema: z.object({
    ...pageMeta,
    heading: z.string(),
    text: z.string(),
    linkLabel: z.string(),
  }),
});

export const collections = {
  site,
  programs,
  schedule,
  pricing,
  faqs,
  testimonials,
  home,
  schedulePage,
  firstClass,
  about,
  parties,
  waitlist,
  contact,
  policies,
  notFound,
};
