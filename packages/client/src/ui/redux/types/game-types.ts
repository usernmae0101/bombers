import { Socket } from "socket.io-client"

import * as Shared from "@bombers/shared/src/idnex";;

export const ACTION_TYPE_GAME_SET_PING = "GAME/SET_PING";
export const ACTION_TYPE_GAME_SET_BOMBS = "GAME/SET_BOMBS";
export const ACTION_TYPE_GAME_SET_SPEED = "GAME/SET_SPEED";
export const ACTION_TYPE_GAME_SET_RADIUS = "GAME/SET_RADIUS";
export const ACTION_TYPE_GAME_SET_SLOTS = "GAME/SET_SLOTS";
export const ACTION_TYPE_GAME_SET_LOADING = "GAME/SET_LOADING";
export const ACTION_TYPE_GAME_SET_COLOR = "GAME/SET_COLOR";
export const ACTION_TYPE_GAME_SET_TCP_SOCKET = "GAME/SET_TCP_SOCKET";

export type GameStateType = {
    color: Shared.Enums.PlayerColors;
    isLoading: boolean;
    HUD: {
        ping: number;
        bombs: number;
        radius: number;
        speed: number;
    };
    TCPSocket: Socket; 
    slots: Shared.Interfaces.IGameSlots;
}

export type GameSetLoadingActionType = {
    type: typeof ACTION_TYPE_GAME_SET_LOADING,
    payload: boolean;
};

export type GameSetPingActionType = {
    type: typeof ACTION_TYPE_GAME_SET_PING;
    payload: number;
};

export type GameSetBombsActionType = {
    type: typeof ACTION_TYPE_GAME_SET_BOMBS;
    payload: number;
};

export type GameSetSpeedActionType = {
    type: typeof ACTION_TYPE_GAME_SET_SPEED;
    payload: number;
};

export type GameSetRadiusActionType = {
    type: typeof ACTION_TYPE_GAME_SET_RADIUS;
    payload: number;
};

export type GameSetTCPSocketActionType = {
    type: typeof ACTION_TYPE_GAME_SET_TCP_SOCKET;
    payload: Socket;
};

export type GameSetSlotsActionType = {
    type: typeof ACTION_TYPE_GAME_SET_SLOTS;
    payload: Shared.Interfaces.IGameSlots;
};

export type GameSetColorActionType = {
    type: typeof ACTION_TYPE_GAME_SET_COLOR;
    payload: Shared.Enums.PlayerColors;
};

export type GameActionsType = GameSetRadiusActionType | GameSetSpeedActionType 
    | GameSetBombsActionType | GameSetSlotsActionType | GameSetPingActionType 
    | GameSetLoadingActionType | GameSetColorActionType | GameSetTCPSocketActionType;