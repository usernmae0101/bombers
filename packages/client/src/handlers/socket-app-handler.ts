import { Dispatch } from "redux";
import { action_dashboard_set_online_chat, action_dashboard_set_online_game } from "../ui/redux/actions/dashboard-actions";

export interface IOnline {
    game: number;
    chat: number;
}

export const handle_socket_app_online = (dispatch: Dispatch, online: IOnline) => {
    dispatch(action_dashboard_set_online_chat(online.chat));
    dispatch(action_dashboard_set_online_game(online.game));
};