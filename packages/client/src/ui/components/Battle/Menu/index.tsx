import { GameState, SocketChannels } from "@bombers/shared/src/idnex";
import { Room } from "colyseus.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { action_game_set_ready } from "../../../redux/actions/game-actions";
import { select_game_ready } from "../../../redux/selectors/game-selectors";
import { select_user_socket_room_battle } from "../../../redux/selectors/user-selecrots";

const Menu = () => {
    const dispatch = useDispatch();

    const room = useSelector(select_user_socket_room_battle);
    const isReady = useSelector(select_game_ready);

    const [startTimer, setStatrtTimer] = useState(5);

    useEffect(() => {
        room.onMessage(SocketChannels.BATTLE_ON_SET_START_TIMER, (timer: number) => {
            setStatrtTimer(timer);
        });
    }, []);

    const sendReadyStatus = () => {
        room.send(SocketChannels.BATTLE_ON_SEND_READY, !isReady);

        dispatch(action_game_set_ready(!isReady));
    };

    return (
        <div>
            <button onClick={sendReadyStatus}>{isReady && "не"} готов</button>
            <span>запуск через {startTimer}</span>
        </div>
    );
};

export default Menu;