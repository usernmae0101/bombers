import * as LobbyTypes from "../types/lobby-types";

export const action_lobby_add_server = (
    server: LobbyTypes.LobbyServerType
): LobbyTypes.LobbyAddServerActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_ADD_SERVER,
    payload: server
});

