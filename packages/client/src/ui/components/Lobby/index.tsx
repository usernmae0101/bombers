import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Room as LobbyRoom, RoomAvailable } from "colyseus.js";

import { select_lobby_rooms_all } from "../../redux/selectors/lobby-selectors";
import { select_user_socket_instance } from "../../redux/selectors/user-selecrots";
import Room from "./Room";
import { action_lobby_set_rooms, action_lobby_update_room } from "../../redux/actions/lobby-actions";

const Lobby = () => {
    const dispatch = useDispatch();

    const rooms = useSelector(select_lobby_rooms_all);
    const socket = useSelector(select_user_socket_instance);

    React.useEffect(() => {
        let lobby: LobbyRoom;

        (async () => {
            lobby = await socket.joinOrCreate("lobby");

            lobby.onMessage("rooms", rooms => {
                const _rooms: RoomAvailable[] = [];

                for (let room of rooms) {
                    // @ts-ignore
                    room.name === "battle" && _rooms.push(room);
                }

                dispatch(action_lobby_set_rooms(_rooms));
            });

            lobby.onMessage("+", ([_, room]) => {
                dispatch(action_lobby_update_room(room));
            });
        })();

        return () => {
            lobby && lobby.leave();
        }
    }, []);

    return (
        <div className="lobby">
            <ul>
                {
                    rooms.map(room => <Room key={room.roomId} room={room}/>)
                }
            </ul>
        </div>
    );
};

export default Lobby;