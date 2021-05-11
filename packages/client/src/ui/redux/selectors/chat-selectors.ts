import { AppStateType } from "../store";
import { ChatMemberType, ChatMessageType } from "../types/chat-types";

export const select_chat_members_all = (state: AppStateType): ChatMemberType[] => {
    return state.chat.members;
};

export const select_chat_ready = (state: AppStateType): boolean => {
    return state.chat.isReady;
};

export const select_chat_messages_all = (state: AppStateType): ChatMessageType[] => {
    return state.chat.messages;
};
