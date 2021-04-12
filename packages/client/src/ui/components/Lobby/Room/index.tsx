import { RoomAvailable } from "colyseus.js";
import React from "react";
import { NavLink } from "react-router-dom";

const Room: React.FC<{ room: RoomAvailable }> = ({ room }) => {
    return (
        <li>
            <div>
                <span>{room.metadata?.id}</span>
                <span>[карта?]</span>
                <span>{room.clients}/{room.maxClients}</span>
                {
                    !room.metadata?.isLocked &&
                    <NavLink to={`/room/${room.roomId}`}>войти</NavLink>
                }
            </div>
        </li>
    );
};

export default Room;