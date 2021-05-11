import * as Shared from "@bombers/shared/src/idnex";

export const ACTION_TYPE_LOBBY_SET_TOTAL_SERVERS = "LOBBY/SET_TOTAL_SERVERS";
export const ACTION_TYPE_LOBBY_SET_LOADING = "LOBBY/SET_LOADING";
export const ACTION_TYPE_LOBBY_SET_SERVERS = "LOBBY/SET_SERVERS";

export type LobbyStateType = {
	servers: LobbyServerType[];
	pagination: LobbyPaginationType;
	totalServers: number;
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

export type LobbySetLoadingActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_LOADING,
	payload: boolean;
};

export type LobbySetTotalServersActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_TOTAL_SERVERS;
	payload: number;
};

export type LobbySetServersActionType = {
	type: typeof ACTION_TYPE_LOBBY_SET_SERVERS;
	payload: LobbyServerType[];
};

export type LobbyActionsType = LobbySetServersActionType | LobbySetLoadingActionType | LobbySetTotalServersActionType;
