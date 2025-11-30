const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const webpack = require("webpack");
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");

const devConfig = {
	mode: "development",
	devServer: {
		port: 8081,
		historyApiFallback: {
			index: "/index.html",
		},
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "marketing",
			filename: "remoteEntry.js",
			exposes: {
				"./MarketingApp": "./src/bootstrap",
			},
			shared: { ...packageJson.dependencies },
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": JSON.stringify(false),
			"process.env.ASSETS_HOST": JSON.stringify("http://localhost:8081"),
		}),
	],
};

module.exports = merge(devConfig, commonConfig);
