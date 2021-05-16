import * as LobbyTypes from "../types/lobby-types";
import * as Shared from "@bombers/shared/src/idnex";

export const action_lobby_set_loading = (
    isLoading: boolean
): LobbyTypes.LobbySetLoadingActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_LOADING,
    payload: isLoading
});

export const action_lobby_set_servers = (
    servers: LobbyTypes.LobbyServerType[]
): LobbyTypes.LobbySetServersActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVERS,
    payload: servers
});

export const action_lobby_set_server_connect_status = (
    address: string,
    isConnected: boolean
): LobbyTypes.LobbySetServerConnectStatusActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_STATUS,
    payload: { address, isConnected }
});

export const action_lobby_set_server_ping = (
    address: string,
    ping: number
): LobbyTypes.LobbySetServerPingActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_PING,
    payload: { address, ping }
});

export const action_lobby_set_server_room = (
    address: string,
    room: Shared.Interfaces.IStateLobbyGameRoom
): LobbyTypes.LobbySetServerRoomActionType => ({
    type: LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_ROOM,
    payload: { address, room }
});
