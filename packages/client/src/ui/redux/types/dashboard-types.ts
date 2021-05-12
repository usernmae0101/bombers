export const ACTION_TYPE_DASHBOARD_SET_ONLINE = "DASHBOARD/SET_ONLINE";
export const ACTION_TYPE_DASHBOARD_SET_TOTAL_SERVERS = "DASHBOARD/SET_TOTAL_SERVERS"; 

export type DashboardStateType = {
    online: number;
	totalServers: number;
};

export type DashboardSetOnlineActionType = {
    type: typeof ACTION_TYPE_DASHBOARD_SET_ONLINE,
    payload: number;
};

export type DashboardSetTotalServersActionType = {
	type: typeof ACTION_TYPE_DASHBOARD_SET_TOTAL_SERVERS;
	payload: number;
};

export type DashboardActionsType = DashboardSetOnlineActionType | DashboardSetTotalServersActionType;
