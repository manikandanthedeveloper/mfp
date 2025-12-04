const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
	entry: "./src/index.js",
	output: {
		filename: "[name].[contenthash].js",
	},
	resolve: {
		extensions: [".js", ".vue", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{
				test: /\.css$/,
				use: ["vue-style-loader", "css-loader"],
			},
			{
				test: /\.s[ac]ss$/i,
				use: ["vue-style-loader", "css-loader", "sass-loader"],
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: ["@babel/plugin-transform-runtime"],
					},
				},
			},
		],
	},
	plugins: [
		new VueLoaderPlugin(),
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
