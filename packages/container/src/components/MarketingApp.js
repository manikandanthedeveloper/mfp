import React, { useEffect, useRef } from "react";

const MarketingApp = () => {
	const ref = useRef(null);

	useEffect(() => {
		const loadMarketing = async () => {
			try {
				const { mount } = await import("marketing/MarketingApp");
				if (mount && ref.current) {
					await mount(ref.current);
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
