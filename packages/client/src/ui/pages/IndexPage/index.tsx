import React from "react";
import { useSelector } from "react-redux";

import Dashboard from "../../components/Dashboard";
import Lobby from "../../components/Lobby";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import BattleResult from "../../components/Battle/Result";
import styles from "./index-page.module.scss";

const IndexPage: React.FC<{ 
	location?: any; 
}> = ({ location }) => {
	return (
		<div className={styles.page}>
			<Navbar />
			<Dashboard />
			<Lobby />

			{ 
				location.state && 

				<BattleResult {...location.state}/> 
			}
		</div>
	);
};

export default IndexPage;
