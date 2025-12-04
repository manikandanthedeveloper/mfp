import { createBrowserHistory } from "history";

const mount = async (el, { onNavigate, defaultHistory }) => {
	const ReactModule = await import("react");
	const ReactDomModule = await import("react-dom");
	const { createMemoryHistory } = await import("history");
	const AppModule = await import("./App");

	const React = ReactModule.default || ReactModule;
	const ReactDom = ReactDomModule.default || ReactDomModule;
	const App = AppModule.default || AppModule;
	const history = defaultHistory || createMemoryHistory();

	if (onNavigate) {
		history.listen(onNavigate);
	}

	ReactDom.render(React.createElement(App, { history }), el);

	// Hot Module Replacement
	if (module.hot) {
		module.hot.accept("./App", async () => {
			const NewAppModule = await import("./App");
			const NewApp = NewAppModule.default || NewAppModule;
			ReactDom.render(React.createElement(NewApp, { history }), el);
		});
	}

	return {
		onParentNavigate({ pathname: nextPathname }) {
			const { pathname } = history.location;

			if (pathname !== nextPathname) {
				history.push(nextPathname);
			}
		},
	};
};

if (process.env.NODE_ENV === "development") {
	const el = document.querySelector("#marketing-root");
	if (el) {
		mount(el, { defaultHistory: createBrowserHistory() });
	}
}

export { mount };
