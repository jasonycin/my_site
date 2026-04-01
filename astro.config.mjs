// @ts-check
import { defineConfig } from 'astro/config';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://jasonlapie.com",
  adapter: vercel({
      webAnalytics: {
          enabled: true,
      },
      isr: {
          expiration: 60 * 60 * 24,
          exclude: [
              /^\/api\/.+/
          ]
      }
  })
});