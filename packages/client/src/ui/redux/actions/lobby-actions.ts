import { RoomAvailable } from "colyseus.js";
import {
    ACTION_TYPE_LOBBY_SET_ROOMS,
    ACTION_TYPE_LOBBY_UPDATE_ROOM,
    LobbySetRoomsActionType, 
    LobbyUpdateRoomActionType
} from "../types/lobby-types";

export const action_lobby_set_rooms = (rooms: RoomAvailable[]): LobbySetRoomsActionType => ({
    type: ACTION_TYPE_LOBBY_SET_ROOMS,
    payload: rooms
});

export const action_lobby_update_room = (room: RoomAvailable): LobbyUpdateRoomActionType => ({
    type: ACTION_TYPE_LOBBY_UPDATE_ROOM,
    payload: room
});