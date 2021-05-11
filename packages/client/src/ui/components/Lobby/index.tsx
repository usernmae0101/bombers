import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as LobbySelectors from "../../redux/selectors/lobby-selectors";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import Loader from "../Loader";
import Server from "./Server";

const Lobby = () => {
    const isLoading = useSelector(LobbySelectors.select_lobby_loading);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    const paginationPage = useSelector(LobbySelectors.select_lobby_pagination_page);
    const paginationItems = useSelector(LobbySelectors.select_lobby_pagination_items);
    const servers = useSelector(LobbySelectors.select_lobby_servers);

    // TODO: доделать пагинацию ("туда", "сюда")

    React.useEffect(() => {
        socket.emit(String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), {
            paginationPage, paginationItems
        });
    }, []);

    if (isLoading) return (<Loader />);

    return (
        <div className="lobby">
            <ul>
                {
                    servers.map(server => {
                        return <Server key={ server.address } { ...server } />
                    }) 
                }
            </ul>
        </div>
    );
};

export default Lobby;
