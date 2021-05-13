import * as LobbyTypes from "../types/lobby-types";

const initialState: LobbyTypes.LobbyStateType = {
    servers: [],
    pagination: {
        page: 1,
        items: 10
    },
    isLoading: true
};

export default function lobbyReducer(
    state = initialState,
    action: LobbyTypes.LobbyActionsType
): LobbyTypes.LobbyStateType {
    switch (action.type) {
        case LobbyTypes.ACTION_TYPE_LOBBY_SET_LOADING:
            return { ...state, isLoading: action.payload };
        case LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVERS:
            return { ...state, servers: action.payload };
        case LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_PING:
            return {
                ...state, servers: state.servers.map(server => {
                    if (server.address === action.payload.address) {
                        server.ping = action.payload.ping;
                    }

                    return server;
                })
            };
        case LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_STATUS:
            return {
                ...state, servers: state.servers.map(server => {
                    if (server.address === action.payload.address) {
                        server.isConnected = action.payload.isConnected;
                    }

                    return server;
                })
            };
        case LobbyTypes.ACTION_TYPE_LOBBY_SET_SERVER_ROOM:
            return {
                ...state, servers: state.servers.map(server => {
                    if (server.address === action.payload.address) {
                        server.room = action.payload.room;
                    }

                    return server;
                })
            };
        default: return state;
    }
}
