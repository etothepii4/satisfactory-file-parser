const path = require('path');

module.exports = {
	entry: {
		"index": './src/index.ts'
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	externals: {
		'node:stream/web': 'node:stream/web',
		'stream/web': 'stream/web'
	},
	output: {
		filename: '[name].mjs',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: "umd",
		globalObject: 'this'
	}
};