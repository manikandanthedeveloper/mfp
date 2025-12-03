const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
						plugins: ["@babel/plugin-transform-runtime"],
					},
				},
			},
		],
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "../public"),
					to: "public",
				},
			],
		}),
	],
};
