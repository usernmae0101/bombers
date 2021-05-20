import React from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

import { LobbyServerType } from "../../../redux/types/lobby-types";
import Room from "./Room";
import { startHandlingGameLobbySocket } from "../../../../handlers/socket-game-lobby-handler";

const Server: React.FC<LobbyServerType> = (props) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const lobbySocket = io(`http://${props.address}:${props.TCP_port}/lobby`);
        
        startHandlingGameLobbySocket(props.address, lobbySocket, dispatch);

        return () => {
            lobbySocket.disconnect();
        };
    }, []);

    return (
        <li>
            <div>
                {
                    !props.isConnected ? <div>connecting..</div> :
                        <div>
                            <span>{props.address} | </span>
                            <Room 
                                address={props.address} 
                                port={props.TCP_port} 
                                {...props.room}
                            />
                            <span> | {props.ping}</span>
                        </div>
                }
            </div>
        </li>
    );
};

export default React.memo(Server);
