module.exports = {
    parser: "@typescript-eslint/parser", // conseguir lidar com a parte de typescript
    env: {
        //conseguir trabalhar com browser
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: ["react", "prettier", "@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module", //módulos js
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    ignorePatterns: ["node_modules/"],
    // Cherry of the Cake
    rules: {
        "no-console": "error",
        "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
    },
};
