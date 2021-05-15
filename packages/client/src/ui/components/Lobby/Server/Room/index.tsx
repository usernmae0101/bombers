import React from "react";
import { useHistory } from "react-router-dom";

import { IGameRoom } from "@bombers/shared/src/utils/interfaces";

type RoomPropsType = {
    address: string;
    port: number;
};

const Room: React.FC<IGameRoom & RoomPropsType> = (props) => {
    const history = useHistory();

    const joinRoom = () => {
        history.push(`room/${props.address}/${props.port}`);
    };

    return ( 
        <React.Fragment>
            <span>{props.activeSlots} / {props.totalSlots}</span>
            <button onClick={joinRoom}>подключиться</button>
        </React.Fragment>
    );
};

export default React.memo(Room);
