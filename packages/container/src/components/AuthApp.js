import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

const AuthApp = ({ onSignIn }) => {
	const ref = useRef(null);
	const history = useHistory();

	useEffect(() => {
		const loadAuth = async () => {
			try {
				const { mount } = await import("auth/AuthApp");
				if (mount && ref.current) {
					const { onParentNavigate } = await mount(ref.current, {
						initialPath: history.location.pathname,
						onNavigate: ({ pathname: nextPathname }) => {
							const { pathname } = history.location;

							if (pathname !== nextPathname) {
								history.push(nextPathname);
							}
						},
						onSignIn: () => {
							console.log("User signed in with auth state:");
							onSignIn();
						},
					});
					history.listen(onParentNavigate);
				}
			} catch (err) {
				console.error("Failed to load marketing microfrontend:", err);
			}
		};

		loadAuth();
	}, []);

	return <div ref={ref} />;
};

export default AuthApp;
