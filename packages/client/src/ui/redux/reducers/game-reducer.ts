import { slots } from "@bombers/shared/src/idnex";
import {
    ACTION_TYPE_GAME_SET_BOMBS,
    ACTION_TYPE_GAME_SET_INSTANCE,
    ACTION_TYPE_GAME_SET_PING,
    ACTION_TYPE_GAME_SET_RADIUS,
    ACTION_TYPE_GAME_SET_READY, ACTION_TYPE_GAME_SET_SLOTS, ACTION_TYPE_GAME_SET_SPEED, GameActionsType,
    GameStateType
} from "../types/game-types";

const initialState: GameStateType = {
    instance: null,
    isReady: false,
    HUD: {
        ping: null,
        bombs: 1,
        speed: 1,
        radius: 1
    },
    slots: slots
}

export default function gameReducer(state = initialState, action: GameActionsType): GameStateType {
    switch (action.type) {
        case ACTION_TYPE_GAME_SET_INSTANCE:
            return { ...state, instance: action.payload };
        case ACTION_TYPE_GAME_SET_READY:
            return { ...state, isReady: action.payload };
        case ACTION_TYPE_GAME_SET_PING:
            return { ...state, HUD: { ...state.HUD, ping: action.payload } };
        case ACTION_TYPE_GAME_SET_BOMBS:
            return { ...state, HUD: { ...state.HUD, bombs: action.payload } };
        case ACTION_TYPE_GAME_SET_SPEED:
            return { ...state, HUD: { ...state.HUD, speed: action.payload } };
        case ACTION_TYPE_GAME_SET_RADIUS:
            return { ...state, HUD: { ...state.HUD, radius: action.payload } };
        case ACTION_TYPE_GAME_SET_SLOTS:
            return { ...state, slots: action.payload };
        default: return state;
    }
}