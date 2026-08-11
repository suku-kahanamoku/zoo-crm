export default defineNuxtConfig({
  compatibilityDate: "2026-05-04",
  ssr: true,

  site: {
    url: process.env.FRONTEND_HOST,
    name: "Zoo CRM",
  },

  devtools: { enabled: true },

  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },

  modules: [
    "@nuxt/image",
    "@suku-kahanamoku/auth-module",
    "@suku-kahanamoku/menu-module",
    "@suku-kahanamoku/form-module",
    "@suku-kahanamoku/ui-module",
    "@suku-kahanamoku/lang-module",
    "@suku-kahanamoku/common-module",
  ],

  authModule: {
    protectedPages: ["/admin"],
  },

  css: ["@/assets/css/main.css"],

  ui: {
    prefix: "U",
  },

  runtimeConfig: {
    phpApiBaseUrl: process.env.PHP_API_BASE_URL,
    phpFileRoot: process.env.PHP_FILE_ROOT,
    public: {
      frontendHost: process.env.FRONTEND_HOST,
    },
  },

  i18n: {
    defaultLocale: "cs",
    langDir: "locales/",
    locales: [
      {
        code: "cs",
        language: "cs-CZ",
        icon: "emojione:flag-for-czechia",
        file: "./cs.json",
      },
      {
        code: "en",
        language: "en-US",
        icon: "emojione:flag-for-united-kingdom",
        file: "./en.json",
      },
    ],
  },
});
