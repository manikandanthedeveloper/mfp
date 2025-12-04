const { merge } = require("webpack-merge");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");
const webpack = require("webpack");
const domain = process.env.PRODUCTION_DOMAIN_DASHBOARD;

const prodConfig = {
	mode: "production",
	output: {
		filename: "[name].[contenthash].js",
		publicPath: `${domain}/dashboard/`,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": JSON.stringify(true),
			__VUE_OPTIONS_API__: JSON.stringify(true),
			__VUE_PROD_DEVTOOLS__: JSON.stringify(false),
		}),
		new ModuleFederationPlugin({
			name: "dashboard",
			filename: "remoteEntry.js",
			exposes: {
				"./DashboardApp": "./src/bootstrap",
			},
			shared: { ...packageJson.dependencies },
		}),
	],
};

module.exports = merge(prodConfig, commonConfig);
