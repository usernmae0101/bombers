import React from "react";
import { useSelector } from "react-redux";

import Chat from "../../components/Chat";
import Dashboard from "../../components/Dashboard";
import Lobby from "../../components/Lobby";
import Navbar from "../../components/Navbar";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";
import Loader from "../../components/Loader";
import Result from "../../components/Battle/Result";

const IndexPage: React.FC<{ 
	location?: any; 
}> = ({ location }) => {
	const isChatLoaded = useSelector(ChatSelectors.select_chat_ready); 
	
	if (!isChatLoaded) return <Loader />;

	return (
		<main>
			<Navbar />
			<Dashboard />
			<Lobby />
			<Chat />
			{ location.state && <Result {...location.state}/> }
		</main>
	);
};

export default IndexPage;
