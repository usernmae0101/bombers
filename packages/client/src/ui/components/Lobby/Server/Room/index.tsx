import React from "react";

import { IGameRoom } from "@bombers/shared/src/utils/interfaces";

const Room: React.FC<IGameRoom> = (room) => {
    return (
        <li>
            <div>
                <span>{ room.activeSlots} / { room.totalSlots }</span>
                <button>подключиться</button>
            </div>
        </li>
    );
};

export default React.memo(Room);