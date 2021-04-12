import {
    ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT,
    ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME,
    DashboardActionsType,
    DashboardStateType
} from "../types/dashboard-types";

const initialState: DashboardStateType = {
    online: {
        game: 0,
        chat: 0
    }
};

export default function dashboardReducer(state = initialState, action: DashboardActionsType): DashboardStateType {
    switch (action.type) {
        case ACTION_TYPE_DASHBOARD_SET_ONLINE_CHAT:
            return {...state, online: {...state.online, chat: action.payload}};
        case ACTION_TYPE_DASHBOARD_SET_ONLINE_GAME:
            return {...state, online: {...state.online, game: action.payload}};
        default: return state;
    }
}