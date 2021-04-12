import {
    ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT,
    ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME,
    DashboardSetOnlineChatActionType,
    DashboardSetOnlineGameActionType
} from "../types/dashboard-types";

export const action_dashboard_set_online_game = (online: number): DashboardSetOnlineGameActionType => ({
    type: ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME,
    payload: online
});

export const action_dashboard_set_online_chat = (online: number): DashboardSetOnlineChatActionType => ({
    type: ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT,
    payload: online
});