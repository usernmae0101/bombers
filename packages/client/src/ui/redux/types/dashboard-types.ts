export const ACTION_TYPE_DASHBOARD_SET_ONLINE = "DASHBOARD/SET_ONLINE";

export type DashboardStateType = {
    online: number;
};

export type DashboardSetOnlineActionType = {
    type: typeof ACTION_TYPE_DASHBOARD_SET_ONLINE,
    payload: number;
};

export type DashboardActionsType = DashboardSetOnlineActionType;