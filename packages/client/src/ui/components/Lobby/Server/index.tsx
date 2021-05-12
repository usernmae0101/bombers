import React from "react";
import geckos from "@geckos.io/client";

import { LobbyServerType } from "../../../redux/types/lobby-types";
import Room from "./Room";

const Server: React.FC<LobbyServerType> = (server) => {
    React.useEffect(() => {
        const socket = geckos({
            url: `http://${server.address}`,
            port: server.port
        });

        console.log(1); // debugger

        socket.onConnect(error => {
            error && console.error(error);

            console.log(2); // debugger
        });
    
        return () => {
            socket.close();
        };
    }, []);

    return (
        <li>
            <div>
                <span>{ server.address }</span>
                <span>{ server.isConnected ? server.ping : "connecting.." }</span>
            </div>
            <div>
                <ul>
                    {
                        server.rooms.map(room => {
                            return <Room key={room.id} {...room}/>
                        })
                    }
                </ul>
            </div>
        </li>
    );
};

export default Server;
