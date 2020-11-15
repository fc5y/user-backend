module.exports = {
	"env": {
		"commonjs": true,
		"es6": true,
		"node": true,
		"browser": true
	},
	"extends": "eslint:recommended",
	"globals": {
		"__ENV__": "readonly"
	},
	"parserOptions": {
		"ecmaVersion": 12
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
