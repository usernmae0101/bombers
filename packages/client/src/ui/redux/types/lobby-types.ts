import * as Shared from "@bombers/shared/src/idnex";

export const ACTION_TYPE_LOBBY_SET_LOADING = "LOBBY/SET_LOADING";
export const ACTION_TYPE_LOBBY_SET_SERVERS = "LOBBY/SET_SERVERS";
export const ACTION_TYPE_LOBBY_SET_SERVER_PING = "LOBBY/SET_SERVER_PING";
export const ACTION_TYPE_LOBBY_SET_SERVER_STATUS = "LOBBY/SET_SERVER_STATUS";
export const ACTION_TYPE_LOBBY_SET_SERVER_ROOM = "LOBBY/SET_SERVER_ROOM";

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
	TCP_port: number;
	isConnected: boolean;
	ping: number;
	room: Shared.Interfaces.IStateLobbyGameRoom;
};

export type LobbySetServerRoomActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVER_ROOM;
	payload: {
		address: string;
		room: Shared.Interfaces.IStateLobbyGameRoom;
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

export type LobbyActionsType = LobbySetServerRoomActionType | LobbySetServerPingActionType 
	| LobbySetServerConnectStatusActionType | LobbySetServersActionType | LobbySetLoadingActionType;
