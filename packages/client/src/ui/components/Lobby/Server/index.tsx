import React from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

import { LobbyServerType } from "../../../redux/types/lobby-types";
import Room from "./Room";
import { startHandlingGameLobbySocket } from "../../../../helpers/handlers/socket-game-lobby-handler";

const Server: React.FC<LobbyServerType> = (server) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        const lobbySocket = io(`http://${server.address}:${server.TCP_port}/lobby`);

        // замыкаем setInterval, чтобы отсановить пинг сервера при демонтировании компонента
        const getPingInterval = startHandlingGameLobbySocket(server.address, lobbySocket, dispatch);

        return () => {
            lobbySocket.disconnect();
            clearInterval(getPingInterval());
        };
    }, []);

    return (
        <li>
            <div>
                {server.isConnected ? <Room {...server.room} /> : <div>connecting..</div>}
                {server.isConnected ? <div>{server.ping}</div> : null}
            </div>
        </li>
    );
};

export default React.memo(Server);