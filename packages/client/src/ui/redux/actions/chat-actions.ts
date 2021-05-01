import * as ChatTypes from "../types/chat-types";

export const action_chat_set_members = (
    members: ChatTypes.ChatMemberType[]
): ChatTypes.ChatSetMembersActionType => ({
    type: ChatTypes.ACTION_TYPE_CHAT_SET_MEMBERS,
    payload: members
});

export const action_chat_set_messages = (
    messages: ChatTypes.ChatMessageType[]
): ChatTypes.ChatSetMessagesActionType => ({
    type: ChatTypes.ACTION_TYPE_CHAT_SET_MESSAGES,
    payload: messages
});

export const action_chat_add_member = (
    member: ChatTypes.ChatMemberType
): ChatTypes.ChatAddMemberActionType => ({
    type: ChatTypes.ACTION_TYPE_CHAT_ADD_MEMBER,
    payload: member
});

export const action_chat_delete_member = (
    nickname: string
): ChatTypes.ChatDeleteMemberActionType => ({
    type: ChatTypes.ACTION_TYPE_CHAT_DELETE_MEMBER,
    payload: nickname
});

export const action_chat_add_message = (
    message: ChatTypes.ChatMessageType
): ChatTypes.ChatAddMessageActionType => ({
    type: ChatTypes.ACTION_TYPE_CHAT_ADD_MESSAGE,
    payload: message
});
