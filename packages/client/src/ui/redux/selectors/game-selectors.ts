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
    return state.game.HUD.ping;
};

export const select_game_speed = (state: AppStateType): number => {
    return state.game.HUD.speed;
};

export const select_game_bombs = (state: AppStateType): number => {
    return state.game.HUD.bombs;
};

export const select_game_radius = (state: AppStateType): number => {
    return state.game.HUD.radius;
};

export const select_game_slots = (state: AppStateType): ISlots => {
    return state.game.slots;
};