import { AppStateType } from "../store";

export const select_dashboard_online = (state: AppStateType): number => {
    return state.dashboard.online;
};