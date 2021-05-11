import React from "react";

import * as LobbyTypes from "./../../../redux/types/lobby-types";

const Server: React.FC<LobbyTypes.LobbyServerType> = ({
    address,
    port,
    ping,
    iceServers,
    rooms,
    isConnected
}) => {
    return (
        <li>
            <div>
                <span>{ address }</span>
                <span>{ isConnected ? ping : "connecting..." }</span>
            </div>
        </li>
    );
};

export default Server;
