import { RoomAvailable } from "colyseus.js";

export const ACTION_TYPE_LOBBY_SET_ROOMS = "LOBBY/SET_ROOMS";
export const ACTION_TYPE_LOBBY_UPDATE_ROOM = "LOBBY/UPDATE_ROOM";

export type LobbyStateType = {
    rooms: RoomAvailable[];
};

export type LobbySetRoomsActionType = {
    type: typeof ACTION_TYPE_LOBBY_SET_ROOMS,
    payload: RoomAvailable[]
};

export type LobbyUpdateRoomActionType = {
    type: typeof ACTION_TYPE_LOBBY_UPDATE_ROOM,
    payload: RoomAvailable
};

export type LobbyActionsType = LobbySetRoomsActionType | LobbyUpdateRoomActionType;