import * as ChatTypes from "../types/chat-types";

const initialState: ChatTypes.ChatStateType = {
    members: [],
    messages: [],
    isReady: false
};

export default function chatReducer(
    state = initialState,
    action: ChatTypes.ChatActionsType
): ChatTypes.ChatStateType {
    switch (action.type) {
        case ChatTypes.ACTION_TYPE_CHAT_ADD_MESSAGE:
            return { 
                ...state, 
                messages: [...state.messages, action.payload] 
            };
        case ChatTypes.ACTION_TYPE_CHAT_ADD_MEMBER:
            return { 
                ...state, 
                members: [...state.members, action.payload] 
            };
        case ChatTypes.ACTION_TYPE_CHAT_DELETE_MEMBER:
            return {
                ...state, 
                members: state.members.filter(member => {
                	return member.nickname !== action.payload
                })
            };
        case ChatTypes.ACTION_TYPE_CHAT_SET_READY:
            return { ...state, isReady: action.payload };
        case ChatTypes.ACTION_TYPE_CHAT_SET_MESSAGES:
            return { ...state, messages: action.payload };
        case ChatTypes.ACTION_TYPE_CHAT_SET_MEMBERS:
            return { ...state, members: action.payload };
        default: return state;
    }
};
