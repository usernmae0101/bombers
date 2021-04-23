import React from "react";

import { useDispatch, useSelector } from "react-redux";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";

import Member from "./Member";
import Message from "./Message";
import styles from "./chat.module.scss";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import { ChatMemberType, ChatStateType } from "../../redux/types/chat-types";
import * as ChatHandler from "../../../helpers/handlers/socket-chat-handler";
import { Room } from "colyseus.js";
import Form from "./Form";
import Loader from "../Loader";
import { ChatState, SocketChannels } from "@bombers/shared/src/idnex";

const Chat = () => {
    const dispatch = useDispatch();

    const [chatRoom, setChatRoom] = React.useState<Room>(null);

    const nickname = useSelector(UserSelectors.select_user_data_nickname);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    const messages = useSelector(ChatSelectors.select_chat_messages_all);
    const members = useSelector(ChatSelectors.select_chat_members_all);

    React.useEffect(() => {
        let _chatRoom: Room<ChatState>;

        (async () => {
            _chatRoom = await socket.joinOrCreate<ChatState>("chat", {
                nickname
            });

            _chatRoom.state.messages.onAdd = message => {
                ChatHandler.handle_socket_chat_on_message(dispatch, message);
            };
               
            _chatRoom.onMessage(SocketChannels.CHAT_ON_JOIN_MEMBER, (member: ChatMemberType) => {
                ChatHandler.handle_socket_chat_on_join_member(dispatch, member);
            });

            _chatRoom.onMessage(SocketChannels.CHAT_ON_LEAVE_MEMBER, (nickname: string) => {
                ChatHandler.handle_socket_chat_on_leave_member(dispatch, nickname);
            });

            _chatRoom.onMessage(SocketChannels.CHAT_ON_SET_STATE, (chat: ChatStateType) => {
                ChatHandler.handle_socket_chat_on_set_state(dispatch, chat);
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
