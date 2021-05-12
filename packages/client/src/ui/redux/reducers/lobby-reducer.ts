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
        default: return state;
    }
}
