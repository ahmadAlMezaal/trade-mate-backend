console.log("ESLint config is being read");
module.exports = {
    rules: {
        'no-unused-vars': 'warn',
        'no-var': 'error',
        'no-multiple-empty-lines': ['warn', { 'max': 1 }],
        'semi': ['warn', 'always'],
        "@typescript-eslint/no-unused-vars": ["warn", { "args": "after-used", "ignoreRestSiblings": true }],
    },
};
