import {
    ACTION_TYPE_LOBBY_SET_ROOMS,
    ACTION_TYPE_LOBBY_UPDATE_ROOM,
    LobbyActionsType,
    LobbyStateType
} from "../types/lobby-types";

const initialState: LobbyStateType = {
    rooms: []
};

export default function lobbyReducer(state = initialState, action: LobbyActionsType): LobbyStateType {
    switch (action.type) {
        case ACTION_TYPE_LOBBY_UPDATE_ROOM:
            return {
                ...state, rooms: state.rooms.map(room => room.roomId === action.payload.roomId ?
                    action.payload : room)
            }
        case ACTION_TYPE_LOBBY_SET_ROOMS:
            return { ...state, rooms: action.payload };
        default: return state;
    }
}