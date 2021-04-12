import {
    ACTION_TYPE_CHAT_ADD_MEMBER,
    ACTION_TYPE_CHAT_ADD_MESSAGE,
    ACTION_TYPE_CHAT_DELETE_MEMBER,
    ACTION_TYPE_CHAT_SET_MEMBERS,
    ACTION_TYPE_CHAT_SET_MESSAGES,
    ChatAddMemberActionType,
    ChatAddMessageActionType,
    ChatDeleteMemberActionType,
    ChatMemberType, ChatMessageType,
    ChatSetMembersActionType, ChatSetMessagesActionType
} from "../types/chat-types";

export const action_chat_set_members = (members: ChatMemberType[]): ChatSetMembersActionType => ({
    type: ACTION_TYPE_CHAT_SET_MEMBERS,
    payload: members
});

export const action_chat_set_messages = (messages: ChatMessageType[]): ChatSetMessagesActionType => ({
    type: ACTION_TYPE_CHAT_SET_MESSAGES,
    payload: messages
});

export const action_chat_add_member = (member: ChatMemberType): ChatAddMemberActionType => ({
    type: ACTION_TYPE_CHAT_ADD_MEMBER,
    payload: member
});

export const action_chat_delete_member = (nickname: string): ChatDeleteMemberActionType => ({
    type: ACTION_TYPE_CHAT_DELETE_MEMBER,
    payload: nickname
});

export const action_chat_add_message = (message: ChatMessageType):ChatAddMessageActionType => ({
    type: ACTION_TYPE_CHAT_ADD_MESSAGE,
    payload: message
});
