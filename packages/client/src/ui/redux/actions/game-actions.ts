import { ISlots } from "@bombers/shared/src/idnex";
import { IGame } from "../../../game/Game";
import {
    ACTION_TYPE_GAME_SET_INSTANCE,
    ACTION_TYPE_GAME_SET_PING,
    ACTION_TYPE_GAME_SET_READY,
    ACTION_TYPE_GAME_SET_SLOTS,
    GameSetInstanceActionType,
    GameSetPingActionType,
    GameSetReadyActionType,
    GameSetSlotsActionType
} from "../types/game-types";

export const action_game_set_instance = (instance: IGame): GameSetInstanceActionType => ({
    type: ACTION_TYPE_GAME_SET_INSTANCE,
    payload: instance
});

export const action_game_set_ready = (isReady: boolean): GameSetReadyActionType => ({
    type: ACTION_TYPE_GAME_SET_READY,
    payload: isReady
});

export const action_game_set_ping = (ping: number): GameSetPingActionType => ({
    type: ACTION_TYPE_GAME_SET_PING,
    payload: ping
});

export const action_game_set_slots = (slots: ISlots): GameSetSlotsActionType => ({
    type: ACTION_TYPE_GAME_SET_SLOTS,
    payload: slots
});