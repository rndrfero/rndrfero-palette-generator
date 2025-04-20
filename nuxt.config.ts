// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "rndrfero's Readable Palette Checker",
      meta: [
        { 
          name: 'description', 
          content: 'A typography color testing tool that validates text-background combinations in your palette for optimal readability. Test your custom color schemes to ensure text is clear and easy to read for everyone.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  }
});
