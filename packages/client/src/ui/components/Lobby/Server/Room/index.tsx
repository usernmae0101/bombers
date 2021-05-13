import React from "react";

import { IGameRoom } from "@bombers/shared/src/utils/interfaces";

const Room: React.FC<IGameRoom> = (room) => {
    return ( 
        <div>
            <span>{ room.activeSlots} / { room.totalSlots }</span>
            <button>подключиться</button>
        </div>
    );
};

export default React.memo(Room);
