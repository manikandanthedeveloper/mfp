import { createBrowserHistory } from "history";

const mount = async (
	el,
	{ onSignIn, onNavigate, defaultHistory, initialPath }
) => {
	const ReactModule = await import("react");
	const ReactDomModule = await import("react-dom");
	const { createMemoryHistory } = await import("history");
	const AppModule = await import("./App");

	const React = ReactModule.default || ReactModule;
	const ReactDom = ReactDomModule.default || ReactDomModule;
	const App = AppModule.default || AppModule;
	const history =
		defaultHistory ||
		createMemoryHistory({ initialEntries: [initialPath] });

	if (onNavigate) {
		history.listen(onNavigate);
	}

	ReactDom.render(React.createElement(App, { history, onSignIn }), el);

	// Hot Module Replacement
	if (module.hot) {
		module.hot.accept("./App", async () => {
			const NewAppModule = await import("./App");
			const NewApp = NewAppModule.default || NewAppModule;
			ReactDom.render(
				React.createElement(NewApp, { history, onSignIn }),
				el
			);
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
	const el = document.querySelector("#auth-root");
	if (el) {
		mount(el, { defaultHistory: createBrowserHistory() });
	}
}

export { mount };
