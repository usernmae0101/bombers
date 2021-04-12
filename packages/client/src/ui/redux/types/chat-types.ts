export const ACTION_TYPE_CHAT_SET_MESSAGES = "CHAT/SET_MESSAGES";
export const ACTION_TYPE_CHAT_SET_MEMBERS = "CHAT/SET_MEMBERS";
export const ACTION_TYPE_CHAT_ADD_MESSAGE = "CHAT/SET_MESSAGE";
export const ACTION_TYPE_CHAT_ADD_MEMBER = "CHAT/ADD_MEMBER";
export const ACTION_TYPE_CHAT_DELETE_MEMBER = "CHAT/DELETE_MEMBER";

export type ChatStateType = {
	messages: ChatMessageType[],
	members: ChatMemberType[]
};

export type ChatMessageType = {
	author: string;
	message: string;
	avatar: string;
	date: number;
};

export type ChatMemberType = {
	nickname: string;
};

export type ChatSetMessagesActionType = {
	type: typeof ACTION_TYPE_CHAT_SET_MESSAGES,
	payload: ChatMessageType[]
};

export type ChatSetMembersActionType = {
	type: typeof ACTION_TYPE_CHAT_SET_MEMBERS,
	payload: ChatMemberType[]
};

export type ChatDeleteMemberActionType = {
	type: typeof ACTION_TYPE_CHAT_DELETE_MEMBER,
	payload: string;
};

export type ChatAddMemberActionType = {
	type: typeof ACTION_TYPE_CHAT_ADD_MEMBER,
	payload: ChatMemberType;
};

export type ChatAddMessageActionType = {
	type: typeof ACTION_TYPE_CHAT_ADD_MESSAGE,
	payload: ChatMessageType;
};

export type ChatActionsType = ChatAddMessageActionType | ChatAddMemberActionType |
	ChatDeleteMemberActionType | ChatSetMessagesActionType | ChatSetMembersActionType;
