import React from "react";

import { LobbyServerType } from "../../../redux/types/lobby-types";
import Room from "./Room";

const Server: React.FC<LobbyServerType> = (server) => {
    React.useEffect(() => {

        return () => {
            
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
