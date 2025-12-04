import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const DashboardApp = () => {
	const ref = useRef(null);
	const history = useHistory();

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const { mount } = await import("dashboard/DashboardApp");
				if (mount && ref.current) {
					const { onParentNavigate } = await mount(ref.current, {
						initialPath: history.location.pathname,
						onNavigate: ({ pathname: nextPathname }) => {
							const { pathname } = history.location;
							if (pathname !== nextPathname) {
								history.push(nextPathname);
							}
						},
					});

					if (onParentNavigate) {
						history.listen(onParentNavigate);
					}
				}
			} catch (err) {
				console.error("Failed to load dashboard microfrontend:", err);
			}
		};

		loadDashboard();
	}, []);

	return <div ref={ref} />;
};

export default DashboardApp;
