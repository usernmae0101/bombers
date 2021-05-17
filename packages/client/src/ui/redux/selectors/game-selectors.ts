import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import { AppStateType } from "../store";

export const select_game_ping = (state: AppStateType): number => {
    return state.game.HUD.ping;
};

export const select_game_loading = (state: AppStateType): boolean => {
    return state.game.isLoading;
};

export const select_game_color = (state: AppStateType): Shared.Enums.PlayerColors => {
    return state.game.color;
};

export const select_game_speed = (state: AppStateType): number => {
    return state.game.HUD.speed;
};

export const select_game_tcp_socket = (state: AppStateType): Socket => {
    return state.game.TCPSocket;
};

export const select_game_bombs = (state: AppStateType): number => {
    return state.game.HUD.bombs;
};

export const select_game_radius = (state: AppStateType): number => {
    return state.game.HUD.radius;
};

export const select_game_slots = (state: AppStateType): Shared.Interfaces.IGameSlots => {
    return state.game.slots;
};