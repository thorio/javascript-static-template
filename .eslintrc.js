/* eslint-env node */
module.exports = {
	"env": {
		"browser": true,
		"es2020": true,
	},
	"extends": "eslint:recommended",
	"globals": {},
	"parserOptions": {
		"sourceType": "module",
	},
	"rules": {
		"require-atomic-updates": "off",
		"no-unused-vars": "warn",
		"no-useless-escape": "warn",
		"no-await-in-loop": "warn",
		"dot-location": ["warn", "property"],
		"semi": "warn",
		"no-restricted-globals": ["error", "status"],
		"comma-dangle": ["warn", {
			"arrays": "always-multiline",
			"objects": "always-multiline",
		}],
	},
};
