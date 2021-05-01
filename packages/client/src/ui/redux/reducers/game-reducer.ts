import * as Shared from "@bombers/shared/src/idnex";
import * as GameTypes from "../types/game-types";

const initialState: GameTypes.GameStateType = {
    isReady: false,
    HUD: {
        ping: null,
        bombs: 1,
        speed: 1,
        radius: 1
    },
    slots: Shared.Slots.slots
}

export default function gameReducer(
    state = initialState,
    action: GameTypes.GameActionsType
): GameTypes.GameStateType {
    switch (action.type) {
        case GameTypes.ACTION_TYPE_GAME_SET_READY:
            return { ...state, isReady: action.payload };
        case GameTypes.ACTION_TYPE_GAME_SET_PING:
            return { ...state, HUD: { ...state.HUD, ping: action.payload } };
        case GameTypes.ACTION_TYPE_GAME_SET_BOMBS:
            return { ...state, HUD: { ...state.HUD, bombs: action.payload } };
        case GameTypes.ACTION_TYPE_GAME_SET_SPEED:
            return { ...state, HUD: { ...state.HUD, speed: action.payload } };
        case GameTypes.ACTION_TYPE_GAME_SET_RADIUS:
            return { ...state, HUD: { ...state.HUD, radius: action.payload } };
        case GameTypes.ACTION_TYPE_GAME_SET_SLOTS:
            return { ...state, slots: action.payload };
        default: return state;
    }
}