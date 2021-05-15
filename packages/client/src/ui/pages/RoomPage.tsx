import React from "react";
import Battle from "../components/Battle";

import { RoutesPropsType } from "../Routes";

const RoomPage: React.FC<RoutesPropsType> = ({ match }) => {
    return (
        <main>
            <Battle 
                address={match.params.address}
                port={match.params.port}
            />
        </main>
    );
}; 

export default RoomPage;