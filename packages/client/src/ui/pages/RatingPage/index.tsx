import React from "react" ;
import { useSelector } from "react-redux";

import Chat from "../../components/Chat";
import Navbar from "../../components/Navbar";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";
import Loader from "../../components/Loader";

const RatingPage = () => {
    const isChatLoaded = useSelector(ChatSelectors.select_chat_ready); 
	
    if (!isChatLoaded) return <Loader />;

    return (
        <main>
            <Navbar />
        </main>
    );
};

export default RatingPage;
