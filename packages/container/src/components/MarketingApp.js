import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const MarketingApp = () => {
	const ref = useRef(null);
	const history = useHistory();

	useEffect(() => {
		const loadMarketing = async () => {
			try {
				const { mount } = await import("marketing/MarketingApp");
				if (mount && ref.current) {
					const { onParentNavigate } = await mount(ref.current, {
						onNavigate: ({ pathname: nextPathname }) => {
							const { pathname } = history.location;

							if (pathname !== nextPathname) {
								history.push(nextPathname);
							}
						},
					});
					history.listen(onParentNavigate);
				}
			} catch (err) {
				console.error("Failed to load marketing microfrontend:", err);
			}
		};

		loadMarketing();
	}, []);

	return <div ref={ref} />;
};

export default MarketingApp;
