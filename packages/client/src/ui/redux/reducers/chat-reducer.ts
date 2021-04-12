import {
    ACTION_TYPE_CHAT_ADD_MEMBER,
    ACTION_TYPE_CHAT_ADD_MESSAGE,
    ACTION_TYPE_CHAT_DELETE_MEMBER,
    ACTION_TYPE_CHAT_SET_MEMBERS,
    ACTION_TYPE_CHAT_SET_MESSAGES,
    ChatActionsType,
    ChatStateType
} from "../types/chat-types";

const initialState: ChatStateType = {
    members: [],
    messages: []
};

export default function chatReducer(state = initialState, action: ChatActionsType): ChatStateType {
    switch (action.type) {
        case ACTION_TYPE_CHAT_ADD_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload] };
        case ACTION_TYPE_CHAT_ADD_MEMBER:
            return { ...state, members: [...state.members, action.payload] };
        case ACTION_TYPE_CHAT_DELETE_MEMBER:
            return {
                ...state, members: state.members.filter(member => {
                	return member.nickname !== action.payload
                })
            };
        case ACTION_TYPE_CHAT_SET_MESSAGES:
            return { ...state, messages: action.payload };
        case ACTION_TYPE_CHAT_SET_MEMBERS:
            return { ...state, members: action.payload };
        default: return state;
    }
};
