const { merge } = require("webpack-merge");
const ModuleFederationPlugin =
	require("webpack").container.ModuleFederationPlugin;
const commonConfig = require("./webpack.common.js");
const packageJson = require("../package.json");
const domain = process.env.PRODUCTION_DOMAIN;

if (!domain) {
	throw new Error(
		"PRODUCTION_DOMAIN environment variable is required for production builds. " +
			"Please set it in your GitHub Secrets or pass it when building locally."
	);
}

const prodConfig = {
	mode: "production",
	output: {
		filename: "[name].[contenthash].js",
		publicPath: `${domain}/`,
	},
	plugins: [
		new ModuleFederationPlugin({
			name: "container",
			remotes: {
				marketing: `marketing@${domain}/marketing/remoteEntry.js`,
			},
			shared: { ...packageJson.dependencies },
		}),
	],
};

module.exports = merge(prodConfig, commonConfig);
