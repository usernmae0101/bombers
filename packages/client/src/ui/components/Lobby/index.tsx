import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as LobbySelectors from "../../redux/selectors/lobby-selectors";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import Loader from "../Loader";
import Server from "./Server";
import styles from "./lobby.module.scss";

const Lobby = () => {
    const [paginationPage, setPaginationPage] = React.useState(1);

    const isLoading = useSelector(LobbySelectors.select_lobby_loading);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    const paginationItems = useSelector(LobbySelectors.select_lobby_pagination_items);
    const servers = useSelector(LobbySelectors.select_lobby_servers);

    React.useEffect(
        () => {
            socket.emit(
                String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), 
                {
                    paginationPage, 
                    paginationItems
                }
            );
        }, 
        [paginationPage]
    );

    const isDisablePaginationLeft = paginationPage === 1;
    const isDisablePaginationRight = servers.length <= paginationPage * paginationItems;

    if (isLoading) {
        return (<Loader />);
    }

    return (
        <div className={styles.lobby}>
            <div className={styles.left}>
                <button
                    disabled={isDisablePaginationLeft}
                    onClick={() => setPaginationPage(paginationPage - 1)}
                >
                    {"<"}
                </button>
            </div>

            <div className={styles.list}>
                <table>
                    <thead>
                        <tr>
                            <th>map</th>
                            <th>address</th>
                            <th>slots</th>
                            <th>ping</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            servers.map(server => {
                                return <Server key={server.address} {...server} />
                            }) 
                        }
                    </tbody>
                </table>
            </div>

            <div className={styles.right}>
                <button
                    disabled={isDisablePaginationRight}
                    onClick={() => setPaginationPage(paginationPage + 1)}
                >
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default Lobby;
