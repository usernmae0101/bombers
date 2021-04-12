import { RoomAvailable } from "colyseus.js";
import { AppStateType } from "../store";

export const select_lobby_rooms_all = (state: AppStateType): RoomAvailable[] => {
    return state.lobby.rooms;
};