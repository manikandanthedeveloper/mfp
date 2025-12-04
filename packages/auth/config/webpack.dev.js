const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const webpack = require("webpack");
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");

const devConfig = {
	mode: "development",
	output: {
		publicPath: "http://localhost:8082/",
	},
	devServer: {
		port: 8082,
		historyApiFallback: {
			index: "/index.html",
		},
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "auth",
			filename: "remoteEntry.js",
			exposes: {
				"./AuthApp": "./src/bootstrap",
			},
			shared: { ...packageJson.dependencies },
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": JSON.stringify(false),
		}),
	],
};

module.exports = merge(devConfig, commonConfig);
