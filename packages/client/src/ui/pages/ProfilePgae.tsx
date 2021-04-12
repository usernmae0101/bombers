import React from "react";

import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import { RoutesPropsType } from "../Routes";

const ProfilePage: React.FC<RoutesPropsType> = ({ match }) => {
    return (
        <main>
            <Navbar />
            <Chat />
        </main>
    );
};

export default ProfilePage;