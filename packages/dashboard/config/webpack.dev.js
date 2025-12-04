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
		publicPath: "http://localhost:8083/",
	},
	devServer: {
		port: 8083,
		historyApiFallback: {
			index: "/index.html",
		},
		headers: { "Access-Control-Allow-Origin": "*" },
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "dashboard",
			filename: "remoteEntry.js",
			exposes: {
				"./DashboardApp": "./src/bootstrap",
			},
			shared: { ...packageJson.dependencies },
		}),
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": JSON.stringify(false),
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
		}),
	],
};

module.exports = merge(devConfig, commonConfig);
