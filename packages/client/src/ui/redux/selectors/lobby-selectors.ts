import { AppStateType } from "../store";
import * as LobbyTypes from "../types/lobby-types";

export const select_lobby_loading = (state: AppStateType): boolean => {
    return state.lobby.isLoading;
};

export const select_lobby_pagination_page = (state: AppStateType): number => {
    return state.lobby.pagination.page
};

export const select_lobby_pagination_items = (state: AppStateType): number => {
    return state.lobby.pagination.items;
};

export const select_lobby_servers = (state: AppStateType): LobbyTypes.LobbyServerType[] => {
    return state.lobby.servers;
};
