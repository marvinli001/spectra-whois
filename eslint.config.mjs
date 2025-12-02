import eslintConfigNext from "eslint-config-next";

// Next.js 16 ships a first-party flat config; reuse it directly instead of bridging legacy configs.
const eslintConfig = [
  ...eslintConfigNext,
  {
    // React 19 compiler rules are very strict; relax them for now to avoid blocking existing patterns.
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
