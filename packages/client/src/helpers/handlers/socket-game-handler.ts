import { IGameStatePlayer } from "@bombers/shared/src/idnex";
import { Dispatch } from "redux";
import * as GameActions from "../../ui/redux/actions/game-actions";

export const handle_socket_game_on_change_bombs = (dispatch: Dispatch, bombs: number, player: IGameStatePlayer) => {
    if (bombs > player.bombs) {
        dispatch(GameActions.action_game_set_bombs(bombs));
        player.bombs = bombs;
    }
};

export const handle_socket_game_on_change_speed = (dispatch: Dispatch, speed: number, player: IGameStatePlayer) => {
    dispatch(GameActions.action_game_set_speed(speed));
    player.speed = speed;
};

export const handle_socket_game_on_change_radius = (dispatch: Dispatch, radius: number) => {
    dispatch(GameActions.action_game_set_radius(radius));
};