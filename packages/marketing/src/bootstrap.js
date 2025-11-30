const mount = async (el) => {
	const ReactModule = await import("react");
	const ReactDomModule = await import("react-dom");
	const AppModule = await import("./App");

	const React = ReactModule.default || ReactModule;
	const ReactDom = ReactDomModule.default || ReactDomModule;
	const App = AppModule.default || AppModule;

	ReactDom.render(React.createElement(App), el);
};

if (process.env.NODE_ENV === "development") {
	const el = document.querySelector("#marketing-root");
	if (el) {
		mount(el);
	}
}

export { mount };
