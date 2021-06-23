module.exports = {
  locales: ["en", "fr"],
  sourceLocale: "en",
  catalogs: [
    {
      path: "<rootDir>/src/locale/{locale}/messages",
      include: ["<rootDir>/src"],
      exclude: ["**/node_modules/**"],
    },
  ],
}
