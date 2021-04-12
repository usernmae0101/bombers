import { AppStateType } from "../store";

export const select_dashboard_online_game = (state: AppStateType): number => {
    return state.dashboard.online.game;
};

export const select_dashboard_online_chat = (state: AppStateType): number => {
    return state.dashboard.online.chat;
};