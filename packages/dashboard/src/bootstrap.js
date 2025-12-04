const mount = async (el, { onNavigate, defaultHistory, initialPath } = {}) => {
	const { createApp } = await import("vue");
	const { createMemoryHistory } = await import("history");
	const DashboardModule = await import("./components/Dashboard.vue");

	const Dashboard = DashboardModule.default || DashboardModule;
	const history =
		defaultHistory ||
		createMemoryHistory({ initialEntries: [initialPath || "/"] });

	if (onNavigate) {
		history.listen((location, action) => {
			onNavigate(location);
		});
	}

	const app = createApp(Dashboard);
	app.mount(el);

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
	const el = document.querySelector("#dashboard-root");
	if (el) {
		import("history").then(({ createBrowserHistory }) => {
			mount(el, { defaultHistory: createBrowserHistory() });
		});
	}
}

export { mount };
