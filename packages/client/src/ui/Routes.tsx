import React from "react";
import {Switch, Route} from "react-router-dom";

import IndexPage from "./pages/IndexPage";
import ProfilePage from "./pages/ProfilePgae";
import RatingPage from "./pages/RatingPage";
import RoomPage from "./pages/RoomPage";

export type RoutesPropsType = {
	match: {
		params: {
			id: string;
			nickname: string;
		}
	}
};

const Routes = () => (
	<Switch>
		<Route exact path="/" component={IndexPage} />
		<Route exact path="/rating" component={RatingPage} />
		<Route path="/profile/:nickname" component={ProfilePage} />
		<Route path="/room/:id" component={RoomPage} />
	</Switch>
);

export default Routes;
