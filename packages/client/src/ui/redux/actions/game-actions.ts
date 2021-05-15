import * as Shared from "@bombers/shared/src/idnex";
import * as GameTypes from "../types/game-types";

export const action_game_set_ping = (
    ping: number
): GameTypes.GameSetPingActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_PING,
    payload: ping
});

export const action_game_set_loading = (
    isLoading: boolean
): GameTypes.GameSetLoadingActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_LOADING,
    payload: isLoading
});

export const action_game_set_bombs = (
    bombs: number
): GameTypes.GameSetBombsActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_BOMBS,
    payload: bombs
});

export const action_game_set_speed = (
    speed: number
): GameTypes.GameSetSpeedActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_SPEED,
    payload: speed
});

export const action_game_set_radius = (
    radius: number
): GameTypes.GameSetRadiusActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_RADIUS,
    payload: radius
});

export const action_game_set_slots = (
    slots: Shared.Interfaces.IGameSlots
): GameTypes.GameSetSlotsActionType => ({
    type: GameTypes.ACTION_TYPE_GAME_SET_SLOTS,
    payload: slots
});