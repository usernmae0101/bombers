export const ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME = "DASHBOARD/SET_ONLINE_GAME";
export const ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT = "DASHBOARD/SET_ONLINE_CHAT";

export type DashboardStateType = {
    online: {
        game: number;
        chat: number;
    }
};

export type DashboardSetOnlineGameActionType = {
    type: typeof ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME,
    payload: number;
};

export type DashboardSetOnlineChatActionType = {
    type: typeof ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT,
    payload: number;
};

export type DashboardActionsType = DashboardSetOnlineChatActionType | DashboardSetOnlineGameActionType;