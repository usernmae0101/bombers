import React from "react";
import { useSelector } from "react-redux";

import Chat from "../../components/Chat";
import Dashboard from "../../components/Dashboard";
import Lobby from "../../components/Lobby";
import Navbar from "../../components/Navbar";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";
import Loader from "../../components/Loader";
import BattleResult from "../../components/Battle/Result";
import styles from "./index-page.module.scss";

const IndexPage: React.FC<{ 
	location?: any; 
}> = ({ location }) => {
	const isChatLoaded = useSelector(ChatSelectors.select_chat_ready); 
	
	if (!isChatLoaded) return <Loader />;

	return (
		<div className={styles.page}>
			<div className={styles.navbar}>
				<Navbar />
			</div>
			
			<div className={styles.dashboard}>
				<Dashboard />
			</div>

			<div className={styles.lobby}>
				<Lobby />
			</div>

			{ 
				location.state && 

				<BattleResult {...location.state}/> 
			}
		</div>
	);
};

export default IndexPage;
