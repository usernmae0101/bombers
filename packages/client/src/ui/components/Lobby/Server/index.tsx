import React from "react";
import { io } from "socket.io-client";

import { LobbyServerType } from "../../../redux/types/lobby-types";
import Room from "./Room";

const Server: React.FC<LobbyServerType> = (server) => {
    React.useEffect(() => {
        const socket = io(`http://${server.address}:${server.TCP_port}`);
        
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <li>
            <div>
                { server.isConnected ? <Room {...server.room} /> : <div>connecting..</div> }
                { server.isConnected ? <div>{ server.ping }</div> : null }
            </div>
        </li>
    );
};

export default React.memo(Server);
