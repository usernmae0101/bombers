import { ISlots } from "@bombers/shared/src/idnex";
import { IGame } from "../../../game/Game";

export const ACTION_TYPE_GAME_SET_INSTANCE = "GAME/SET_INSTANCE";
export const ACTION_TYPE_GAME_SET_READY = "GAME/SET_READY";
export const ACTION_TYPE_GAME_SET_PING = "GAME/SET_PING";
export const ACTION_TYPE_GAME_SET_BOMBS = "GAME/SET_BOMBS";
export const ACTION_TYPE_GAME_SET_SPEED = "GAME/SET_SPEED";
export const ACTION_TYPE_GAME_SET_RADIUS = "GAME/SET_RADIUS";
export const ACTION_TYPE_GAME_SET_SLOTS = "GAME/SET_SLOTS";

export type GameStateType = {
    instance: IGame;
    isReady: boolean;
    HUD: {
        ping: number;
        bombs: number;
        radius: number;
        speed: number;
    }
    slots: ISlots;
}

export type GameSetInstanceActionType = {
    type: typeof ACTION_TYPE_GAME_SET_INSTANCE;
    payload: IGame;
};

export type GameSetReadyActionType = {
    type: typeof ACTION_TYPE_GAME_SET_READY;
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

export type GameSetSlotsActionType = {
    type: typeof ACTION_TYPE_GAME_SET_SLOTS;
    payload: ISlots;
};

export type GameActionsType = GameSetRadiusActionType | GameSetSpeedActionType | GameSetBombsActionType |
GameSetSlotsActionType | GameSetInstanceActionType | GameSetReadyActionType | GameSetPingActionType;