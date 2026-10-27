import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.string() });

const site = defineCollection({
  loader: glob({ pattern: 'site.yaml', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    adultProgramName: z.string(),
    teenProgramName: z.string(),
    positioning: z.string(),
    description: z.string(),
    city: z.string(),
    state: z.string(),
    email: z.string(),
    phone: z.string().default(''),
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
    footer: z.object({
      links: z.array(link),
      signupHeading: z.string(),
      signupButton: z.string(),
      signupNote: z.string().default(''),
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
    }),
  }),
});

export const collections = { site };
