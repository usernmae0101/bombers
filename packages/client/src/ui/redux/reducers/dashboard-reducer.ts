import * as DashboardTypes from "../types/dashboard-types";

const initialState: DashboardTypes.DashboardStateType = {
    online: 0
};

export default function dashboardReducer(
    state = initialState, 
    action: DashboardTypes.DashboardActionsType
): DashboardTypes.DashboardStateType {
    switch (action.type) {
        case DashboardTypes.ACTION_TYPE_DASHBOARD_SET_ONLINE:
            return { ...state, online: action.payload };
        default: return state;
    }
}