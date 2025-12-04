import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
	StylesProvider,
	createGenerateClassName,
} from "@material-ui/core/styles";

import Header from "./components/Header";
import ProgressBar from "./components/ProgressBar";
import { useState } from "react";

const MarketingApp = React.lazy(() => import("./components/MarketingApp"));
const AuthApp = React.lazy(() => import("./components/AuthApp"));

const generateClassName = createGenerateClassName({
	productionPrefix: "co",
});

export default () => {
	const [isSignedIn, setIsSignedIn] = useState(false);

	return (
		<BrowserRouter>
			<StylesProvider generateClassName={generateClassName}>
				<Header
					isSignedIn={isSignedIn}
					onSignOut={() => setIsSignedIn(false)}
				/>
				<React.Suspense fallback={<ProgressBar />}>
					<Switch>
						<Route path="/auth">
							<AuthApp onSignIn={() => setIsSignedIn(true)} />
						</Route>
						<Route path="/">
							<MarketingApp isSignedIn={isSignedIn} />
						</Route>
					</Switch>
				</React.Suspense>
			</StylesProvider>
		</BrowserRouter>
	);
};
