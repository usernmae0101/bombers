import React from "react";

import { useSelector } from "react-redux";
import * as ChatSelectors from "../../redux/selectors/chat-selectors";

import Member from "./Member";
import Message from "./Message";
import SendForm from "./SendForm";
import styles from "./chat.module.scss";
import Loader from "../Loader";

const Chat = () => {
    const messages = useSelector(ChatSelectors.select_chat_messages_all);
    const members = useSelector(ChatSelectors.select_chat_members_all);
    const isReady = useSelector(ChatSelectors.select_chat_ready);

    if (!isReady) return (<Loader />);

    return (
        <div className={styles.chat}>
            <div className={styles.messages}>
                <ul>{messages.map(message => <Message key={message.date} message={message} />)}</ul>
            </div>
            <div className={styles.members}>
                <ul>{members.map((member, i) => <Member key={member.nickname + i} member={member} />)}</ul>
            </div>
            <SendForm />
        </div>
    );
};

export default Chat;
