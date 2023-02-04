require("@rushstack/eslint-config/patch/modern-module-resolution")

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/node",
    "@rushstack/eslint-config/mixins/friendly-locals",
    "@nodesuite/eslint-config"
  ],
  overrides: [
    {
      files: ["src/**/*.ts"],
      rules: {
        "@typescript-eslint/typedef": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "no-return-assign": "off",
      }
    }
  ]
}
