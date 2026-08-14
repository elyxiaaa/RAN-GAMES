export default {
  content: ["./index.html", "./ranking.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0707",
        ember: "#0C0805",
        panel: "#120B0D",
        burgundy: {
          900: "#240A0C",
          800: "#381013",
          700: "#4E171C",
        },
        crimson: {
          DEFAULT: "#E01F2D",
          hot: "#FF3B47",
        },
        blood: {
          900: "#1A0406",
          800: "#3D070C",
          700: "#6E0D15",
          600: "#A11019",
          500: "#FF2A38",
        },
        rose: "#A89898",
        blush: "#FFE2E2",
        win: "#49C97C",
      },
      fontFamily: {
        display: ['"Oswald Variable"', "Oswald", '"Arial Narrow"', "sans-serif"],
        body: ['"IBM Plex Sans Variable"', '"IBM Plex Sans"', "Arial", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "3px",
        sm: "2px",
        md: "3px",
        lg: "3px",
        xl: "3px",
      },
      boxShadow: {
        cta: "0 8px 24px 0 rgba(224, 31, 45, 0.4)",
        ctaHover: "0 10px 32px 0 rgba(224, 31, 45, 0.55)",
      },
      maxWidth: {
        shell: "1400px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      letterSpacing: {
        brand: "0.02em",
        label: "0.18em",
        wide2: "0.24em",
      },
      keyframes: {
        "live-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.82)" },
        },
        "idle-bob": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) rotate(0deg)" },
          "50%": { transform: "translate3d(0, -0.9%, 0) rotate(-0.2deg)" },
        },
        "slash-breathe": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
        "ember-rise": {
          "0%": { transform: "translate3d(0, 0, 0)", opacity: "0" },
          "14%": { opacity: "0.85" },
          "82%": { opacity: "0.45" },
          "100%": {
            transform: "translate3d(var(--ember-drift, 12px), -440px, 0)",
            opacity: "0",
          },
        },
        "scroll-hint": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "30%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateY(340%)", opacity: "0" },
        },
        "row-in": {
          from: { opacity: "0", transform: "translateY(7px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "storm-flash": {
          "0%, 90%, 100%": { opacity: "0" },
          "91%": { opacity: "0.16" },
          "92.5%": { opacity: "0.03" },
          "94%": { opacity: "0.11" },
          "96%": { opacity: "0" },
        },
      },
      animation: {
        "live-pulse": "live-pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "idle-bob": "idle-bob 6.5s ease-in-out infinite",
        "slash-breathe": "slash-breathe 7s ease-in-out infinite",
        "ember-rise": "ember-rise linear infinite",
        "scroll-hint": "scroll-hint 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        "storm-flash": "storm-flash 11s ease-out infinite",
        "row-in": "row-in 0.44s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
