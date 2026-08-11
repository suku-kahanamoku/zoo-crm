export default defineAppConfig({
  ui: {
    colors: {
      primary: "primary",
      secondary: "secondary",
      info: "blue",
      success: "green",
      warning: "amber",
      error: "red",
      neutral: "slate",
    },
    button: {
      slots: {
        base: "rounded-lg font-semibold shadow-sm transition-all duration-200",
      },
    },
  },
});
