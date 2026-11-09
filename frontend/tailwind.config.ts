import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "color-mix(in srgb, var(--canvas) calc(<alpha-value> * 100%), transparent)",
          deep: "color-mix(in srgb, var(--canvas-deep) calc(<alpha-value> * 100%), transparent)",
        },
        panel: {
          DEFAULT: "color-mix(in srgb, var(--panel) calc(<alpha-value> * 100%), transparent)",
          raised: "color-mix(in srgb, var(--panel-raised) calc(<alpha-value> * 100%), transparent)",
          inset: "color-mix(in srgb, var(--panel-inset) calc(<alpha-value> * 100%), transparent)",
        },
        border: {
          DEFAULT: "color-mix(in srgb, var(--border) calc(<alpha-value> * 100%), transparent)",
          strong: "color-mix(in srgb, var(--border-strong) calc(<alpha-value> * 100%), transparent)",
        },
        canary: {
          text: "color-mix(in srgb, var(--text) calc(<alpha-value> * 100%), transparent)",
          "text-2": "color-mix(in srgb, var(--text-2) calc(<alpha-value> * 100%), transparent)",
          "text-3": "color-mix(in srgb, var(--text-3) calc(<alpha-value> * 100%), transparent)",
          "on-accent": "var(--on-accent)",
          amber: "color-mix(in srgb, var(--amber) calc(<alpha-value> * 100%), transparent)",
          "amber-glow": "color-mix(in srgb, var(--amber-glow) calc(<alpha-value> * 100%), transparent)",
        },
        tier: {
          watch: "color-mix(in srgb, var(--tier-watch) calc(<alpha-value> * 100%), transparent)",
          alert: "color-mix(in srgb, var(--tier-alert) calc(<alpha-value> * 100%), transparent)",
          action: "color-mix(in srgb, var(--tier-action) calc(<alpha-value> * 100%), transparent)",
          "watch-text": "color-mix(in srgb, var(--tier-watch-text) calc(<alpha-value> * 100%), transparent)",
          "alert-text": "color-mix(in srgb, var(--tier-alert-text) calc(<alpha-value> * 100%), transparent)",
          "action-text": "color-mix(in srgb, var(--tier-action-text) calc(<alpha-value> * 100%), transparent)",
        },
        status: {
          ok: "color-mix(in srgb, var(--ok) calc(<alpha-value> * 100%), transparent)",
          stale: "color-mix(in srgb, var(--stale) calc(<alpha-value> * 100%), transparent)",
          missing: "color-mix(in srgb, var(--missing) calc(<alpha-value> * 100%), transparent)",
          info: "color-mix(in srgb, var(--info) calc(<alpha-value> * 100%), transparent)",
        },
        prov: {
          real: "color-mix(in srgb, var(--prov-real) calc(<alpha-value> * 100%), transparent)",
          sim: "color-mix(in srgb, var(--prov-sim) calc(<alpha-value> * 100%), transparent)",
          illus: "color-mix(in srgb, var(--prov-illus) calc(<alpha-value> * 100%), transparent)",
        },
      },
      fontFamily: {
        sans: ["var(--font-ui)"],
      },
      borderRadius: {
        panel: "20px",
        control: "10px",
        badge: "6px",
      },
      boxShadow: {
        panel: "var(--panel-shadow)",
        highlight: "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        "amber-glow": "0 3px 10px var(--amber-glow)",
        "action-glow": "0 0 20px rgba(229, 72, 61, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;

