import * as DashboardTypes from "../types/dashboard-types";

export const action_dashboard_set_total_servers = (
    count: number
): DashboardTypes.DashboardSetTotalServersActionType => ({
   type: DashboardTypes.ACTION_TYPE_DASHBOARD_SET_TOTAL_SERVERS,
   payload: count
});

export const action_dashboard_set_online = (
    online: number
): DashboardTypes.DashboardSetOnlineActionType => ({
    type: DashboardTypes.ACTION_TYPE_DASHBOARD_SET_ONLINE,
    payload: online
});
