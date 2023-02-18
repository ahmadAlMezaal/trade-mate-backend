module.exports = {
    "root": true,
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint",
        "no-loops"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "rules": {
        'prettier/prettier': 0,
        "no-console": 0,
        "no-loops/no-loops": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/semi": [
            "warn"
        ],
        "no-multiple-empty-lines": [
            1,
            {
                "max": 1,
                "maxEOF": 1
            }
        ],
        "no-multi-spaces": [
            "warn",
            {
                "exceptions": {
                    "ImportDeclaration": false,
                    "VariableDeclarator": true
                }
            }
        ]
    }
}