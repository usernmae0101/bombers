import { AppStateType } from "../store";

export const select_dashboard_total_servers = (state: AppStateType): number => {
    return state.dashboard.totalServers;
};

export const select_dashboard_online = (state: AppStateType): number => {
    return state.dashboard.online;
};
