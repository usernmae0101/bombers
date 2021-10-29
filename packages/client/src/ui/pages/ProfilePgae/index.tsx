import React from "react";
import { useSelector } from "react-redux";

import Chat from "../../components/Chat";
import Navbar from "../../components/Navbar";
import { RoutesPropsType } from "../../Routes";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";
import Loader from "../../components/Loader";

const ProfilePage: React.FC<RoutesPropsType> = ({ match }) => {
    const isChatLoaded = useSelector(ChatSelectors.select_chat_ready); 
	
    if (!isChatLoaded) return <Loader />;

    return (
        <main>
            <Navbar />
            <Chat />
        </main>
    );
};

export default ProfilePage;
