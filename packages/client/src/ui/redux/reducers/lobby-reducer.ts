import * as LobbyTypes from "../types/lobby-types"; 

const initialState: LobbyTypes.LobbyStateType = {
    servers: []
};

export default function lobbyReducer(
    state = initialState,
    action: LobbyTypes.LobbyActionsType
): LobbyTypes.LobbyStateType {
    switch (action.type) {
        case LobbyTypes.ACTION_TYPE_LOBBY_ADD_SERVER:
            return { ...state, servers: [ ...state.servers, action.payload ]};
        default: return state;
    }
}
