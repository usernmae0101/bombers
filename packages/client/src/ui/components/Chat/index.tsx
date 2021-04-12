import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { select_chat_members_all, select_chat_messages_all } from "../../redux/selectors/chat-selectors";

import Member from "./Member";
import Message from "./Message";
import styles from "./chat.module.scss";
import { select_user_data_nickname, select_user_socket_instance, select_user_socket_room_app } from "../../redux/selectors/user-selecrots";
import { ChatMemberType, ChatStateType } from "../../redux/types/chat-types";
import { handle_socket_chat_on_message, handle_socket_chat_on_join_member, handle_socket_chat_on_leave_member, handle_socket_chat_on_set_state } from "../../../handlers/socket-chat-handler";
import { Room } from "colyseus.js";
import Form from "./Form";
import Loader from "../Loader";
import { ChatState, SocketChannels } from "@bombers/shared/src/idnex";

const Chat = () => {
    const dispatch = useDispatch();

    const [chatRoom, setChatRoom] = React.useState<Room>(null);

    const appRoom = useSelector(select_user_socket_room_app);
    const nickname = useSelector(select_user_data_nickname);
    const socket = useSelector(select_user_socket_instance);
    const messages = useSelector(select_chat_messages_all);
    const members = useSelector(select_chat_members_all);

    React.useEffect(() => {
        let _chatRoom: Room<ChatState>;

        (async () => {
            _chatRoom = await socket.joinOrCreate<ChatState>("chat", {
                nickname
            });

            _chatRoom.state.messages.onAdd = message => {
                handle_socket_chat_on_message(dispatch, message);
            };
               
            _chatRoom.onMessage(SocketChannels.CHAT_ON_JOIN_MEMBER, (member: ChatMemberType) => {
                handle_socket_chat_on_join_member(dispatch, member);
            });

            _chatRoom.onMessage(SocketChannels.CHAT_ON_LEAVE_MEMBER, (nickname: string) => {
                handle_socket_chat_on_leave_member(dispatch, nickname);
            });

            _chatRoom.onMessage(SocketChannels.CHAT_ON_SET_STATE, (chat: ChatStateType) => {
                handle_socket_chat_on_set_state(dispatch, chat);
            });

            setChatRoom(_chatRoom);
        })();

        return () => {
            _chatRoom && _chatRoom.leave();
        }
    }, []);

    if (!chatRoom) return <Loader />

    return (
        <div className={styles.chat}>
            <div className={styles.messages}>
                <ul>{messages.map(message => <Message key={message.date} message={message} />)}</ul>
            </div>
            <div className={styles.members}>
                <ul>{members.map((member, i) => <Member key={member.nickname + i} member={member} />)}</ul>
            </div>
            <Form chatRoom={chatRoom} />
        </div>
    );
};

export default Chat;
