import { Dispatch } from "redux";

import * as DashboardActions from "../../ui/redux/actions/dashboard-actions";

export const handle_socket_app_online = (dispatch: Dispatch, online: number) => {
    dispatch(DashboardActions.action_dashboard_set_online(online));
};