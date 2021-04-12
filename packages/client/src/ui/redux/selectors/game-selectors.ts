import { ISlots } from "@bombers/shared/src/idnex";
import { IGame } from "../../../game/Game";
import { AppStateType } from "../store";

export const select_game_instance = (state: AppStateType): IGame => {
    return state.game.instance;
};

export const select_game_ready = (state: AppStateType): boolean => {
    return state.game.isReady;
};

export const select_game_ping = (state: AppStateType): number => {
    return state.game.ping;
};

export const select_game_slots = (state: AppStateType): ISlots => {
    return state.game.slots;
};