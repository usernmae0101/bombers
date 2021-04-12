import { slots } from "@bombers/shared/src/idnex";
import {
    ACTION_TYPE_GAME_SET_INSTANCE,
    ACTION_TYPE_GAME_SET_PING,
    ACTION_TYPE_GAME_SET_READY, ACTION_TYPE_GAME_SET_SLOTS, GameActionsType,
    GameStateType
} from "../types/game-types";

const initialState: GameStateType = {
    instance: null,
    isReady: false,
    ping: null,
    slots: slots
}

export default function gameReducer(state = initialState, action: GameActionsType): GameStateType {
    switch (action.type) {
        case ACTION_TYPE_GAME_SET_INSTANCE:
            return { ...state, instance: action.payload };
        case ACTION_TYPE_GAME_SET_READY:
            return { ...state, isReady: action.payload };
        case ACTION_TYPE_GAME_SET_PING:
            return { ...state, ping: action.payload };
        case ACTION_TYPE_GAME_SET_SLOTS:
            return { ...state, slots: action.payload };
        default: return state;
    }
}