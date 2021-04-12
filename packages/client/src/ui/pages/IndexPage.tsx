import React from "react";

import Chat from "../components/Chat";
import Dashboard from "../components/Dashboard";
import Lobby from "../components/Lobby";
import Navbar from "../components/Navbar";

const IndexPage = () => {
	return (
		<main>
			<Navbar />
			<Dashboard />
			<Lobby />
			<Chat />
		</main>
	);
};

export default IndexPage;
