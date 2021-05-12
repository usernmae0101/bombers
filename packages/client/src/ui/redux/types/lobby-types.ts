import * as Shared from "@bombers/shared/src/idnex";

export const ACTION_TYPE_LOBBY_SET_LOADING = "LOBBY/SET_LOADING";
export const ACTION_TYPE_LOBBY_SET_SERVERS = "LOBBY/SET_SERVERS";
export const ACTION_TYPE_LOBBY_SET_SERVER_PING = "LOBBY/SET_SERVER_PING";
export const ACTION_TYPE_LOBBY_SET_SERVER_STATUS = "LOBBY/SET_SERVER_STATUS";
export const ACTION_TYPE_LOBBY_SET_SERVER_ROOMS = "LOBBY/SET_SERVER_ROOMS";
export const ACTION_TYPE_LOBBY_UPDATE_SERVER_ROOM = "LOBBY/UPDATE_SERVER_ROOM";

export type LobbyStateType = {
	servers: LobbyServerType[];
	pagination: LobbyPaginationType;
	isLoading: boolean;
};

export type LobbyPaginationType = {
	page: number;
	items: number;
};

export type LobbyServerType = {
	address: string;
	port: number;
	iceServers: any[];
	isConnected: boolean;
	ping: number;
	rooms: Shared.Interfaces.IGameRoom[];
};

export type LobbySetServerRoomsActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVER_ROOMS;
	payload: {
		address: string;
		rooms: Shared.Interfaces.IGameRoom[];
	};
};

export type LobbyUpdateServerRoomActionType = {
	type: typeof ACTION_TYPE_LOBBY_UPDATE_SERVER_ROOM;
	payload: {
		address: string;
		room: Shared.Interfaces.IGameRoom;
	};
};

export type LobbySetServerPingActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVER_PING;
	payload: {
		address: string;
		ping: number;
	};
};

export type LobbySetServerConnectStatusActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVER_STATUS;
	payload: {
		address: string;
		isConnected: boolean;
	};
};

export type LobbySetLoadingActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_LOADING;
	payload: boolean;
};

export type LobbySetServersActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVERS;
	payload: LobbyServerType[];
};

export type LobbyActionsType = LobbySetServerRoomsActionType | LobbyUpdateServerRoomActionType | 
	LobbySetServerPingActionType | LobbySetServerConnectStatusActionType | LobbySetServersActionType | LobbySetLoadingActionType;
