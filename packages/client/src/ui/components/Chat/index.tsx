import React from "react";

import { useDispatch, useSelector } from "react-redux";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";

import Member from "./Member";
import Message from "./Message";
import styles from "./chat.module.scss";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import * as ChatTypes from "../../redux/types/chat-types";
import * as ChatHandler from "../../../helpers/handlers/socket-chat-handler";
import Form from "./Form";
import Loader from "../Loader";

const Chat = () => {
    const dispatch = useDispatch();

    const nickname = useSelector(UserSelectors.select_user_data_nickname);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
    const messages = useSelector(ChatSelectors.select_chat_messages_all);
    const members = useSelector(ChatSelectors.select_chat_members_all);

    React.useEffect(() => {
       
    }, []);

    if (!false) return <Loader />

    return (
        <div className={styles.chat}>
            <div className={styles.messages}>
                <ul>{messages.map(message => <Message key={message.date} message={message} />)}</ul>
            </div>
            <div className={styles.members}>
                <ul>{members.map((member, i) => <Member key={member.nickname + i} member={member} />)}</ul>
            </div>
        </div>
    );
};

export default Chat;
