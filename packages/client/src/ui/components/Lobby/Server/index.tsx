import React from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";

import { LobbyServerType } from "@bombers/client/src/ui/redux/types/lobby-types";
import styles from "./server.module.scss";
import { startHandlingGameLobbySocket } from "@bombers/client/src/handlers/socket-game-lobby-handler";

const Server: React.FC<LobbyServerType> = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const joinRoom = () => {
        history.push(`room/${props.address}/${props.TCP_port}`);
    };

    React.useEffect(() => {
        const lobbySocket = io(`http://${props.address}:${props.TCP_port}/lobby`);
        
        startHandlingGameLobbySocket(
            props.address, 
            lobbySocket, 
            dispatch
        );

        return () => {
            lobbySocket.disconnect();
        };
    }, []);

    return (
        <>
            <tr className={styles.tr}>
                <td>{props.isConnected && props.room.mapId}</td>
                <td>{props.isConnected && props.address}</td>
                <td>{props.isConnected && `${props.room.activeSlots}/${props.room.totalSlots}`}</td>
                <td>{props.isConnected ? props.ping : "connecting"}</td>
                <td>
                    {
                        props.isConnected && 
                        
                        <button
                            onClick={joinRoom}
                            disabled={props.room.isLocked}
                        >
                            connect
                        </button>
                    }
                </td>
            </tr>
        </>
    );
};

export default React.memo(Server);
