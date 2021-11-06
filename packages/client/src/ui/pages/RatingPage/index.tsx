import React from "react" ;
import { useSelector } from "react-redux";

import Chat from "../../components/Chat";
import Navbar from "../../components/Navbar";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";
import Loader from "../../components/Loader";
import RatingList from "../../components/Rating/RatingList";
import RatingBanner from "../../components/Rating/RatingBanner";
import styles from "./rating-page.module.scss";

const RatingPage = () => {
    const isChatLoaded = useSelector(ChatSelectors.select_chat_ready); 
	
    if (!isChatLoaded) return <Loader />;

    return (
        <div className={styles.page}>
            <Navbar />
            <RatingBanner />
            <RatingList />
        </div>
    );
};

export default RatingPage;
