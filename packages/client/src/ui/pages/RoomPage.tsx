import React from "react";
import Battle from "../components/Battle";

import { RoutesPropsType } from "../Routes";

const RoomPage: React.FC<RoutesPropsType> = ({ match }) => {
    return (
        <main>
            <Battle id={match.params.id}/>
        </main>
    );
};

export default RoomPage;