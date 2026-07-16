import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";


// https://astro.build/config
export default defineConfig({
  site: "https://www.drnathanmarketing.com",
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "viewport",
  },
  integrations: [tailwind(), react(), sitemap({
    // /credentials is a private pitch page shared only by link — keep it
    // out of the sitemap (it is also noindexed via meta + X-Robots-Tag).
    filter: (page) => new URL(page).pathname.replace(/\/$/, "") !== "/credentials",
  }), sanity({
    projectId: "9w1ph2wu",
    dataset: "production",
    useCdn: true,
    apiVersion: "2024-04-05",
  })],
  // "hybrid" output removed in Astro 5. Default "static" handles `export const prerender = false` natively.
  security: {
    checkOrigin: false,
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  image: {
    service: passthroughImageService(),
  },
  vite: {
    ssr: {
      noExternal: ["gsap"],
    },
  },
});