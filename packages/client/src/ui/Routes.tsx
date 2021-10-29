import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import IndexPage from "./pages/IndexPage/";
import ProfilePage from "./pages/ProfilePgae/";
import RatingPage from "./pages/RatingPage/";
import RoomPage from "./pages/RoomPage/";

export type RoutesPropsType = {
	match: {
		params: {
			address: string;
			port: string;
			nickname: string;
		}
	}
};

const checkoutRedirect = (
	roomToRedirect: string,
	Component: React.FC,
	props?: any
) => {
	if (roomToRedirect.length)
		return <Redirect to={"/room/" + roomToRedirect} />;
	
	return <Component {...props} />
};

const Routes: React.FC<{ roomToRedirect: string}> = ({ 
	roomToRedirect 
}) => {

	return (
		<Switch>
			<Route 
				exact 
				path="/" 
				render={(props: any) => checkoutRedirect(roomToRedirect, IndexPage, props)} 
			/>
			<Route 
				path="/rating" 
				render={() => checkoutRedirect(roomToRedirect, RatingPage)} 
			/>
			<Route 
				path="/profile/:nickname" 
				render={() => checkoutRedirect(roomToRedirect, ProfilePage)} 
			/>
			<Route 
				path="/room/:address/:port" 
				component={RoomPage} 
			/>
		</Switch>
	);
};

export default Routes;
