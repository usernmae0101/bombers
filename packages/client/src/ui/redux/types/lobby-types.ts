export const ACTION_TYPE_LOBBY_ADD_SERVER = "LOBBY/ADD_SERVER";

export type LobbyStateType = {
	servers: LobbyServerType[];
};

export type LobbyServerType = {
	address: string;
	port: number;
	iceServers: any[];
	isConnected: boolean;
	// FIXME: добавить тип к сокету
	UDPSocketInstance: any;
	// TODO: добавить TCP (надёжная доставка)
};

export type LobbyAddServerActionType = {
	type: typeof ACTION_TYPE_LOBBY_ADD_SERVER;
	payload: LobbyServerType;
};

export type LobbyActionsType = LobbyAddServerActionType;
