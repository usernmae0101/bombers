import { Dispatch } from "redux";
import {
    action_chat_add_member, action_chat_add_message,
    action_chat_delete_member, action_chat_set_members, action_chat_set_messages
} from "../../ui/redux/actions/chat-actions";
import { ChatMemberType, ChatMessageType, ChatStateType } from "../../ui/redux/types/chat-types";

export const handle_socket_chat_on_message = (dispatch: Dispatch, message: ChatMessageType) => {
    dispatch(action_chat_add_message({
        author: message.author,
        avatar: message.avatar,
        date: message.date,
        message: message.message
    }));
};

export const handle_socket_chat_on_set_state = (dispatch: Dispatch, chat: ChatStateType) => {
    dispatch(action_chat_set_members(chat.members));
    dispatch(action_chat_set_messages(chat.messages));
};

export const handle_socket_chat_on_join_member = (dispatch: Dispatch, member: ChatMemberType) => {
    dispatch(action_chat_add_member(member));
};

export const handle_socket_chat_on_leave_member = (dispatch: Dispatch, nickname: string) => {
    dispatch(action_chat_delete_member(nickname));
};
