import React from "react";

import { ChatMessageType } from "../../../redux/types/chat-types";

const Message: React.FC<{ message: ChatMessageType }> = ({ message }) => {
    return (
        <li>
			<div>
				<img src={message.author.avatar}/>
				<span>{message.author.nickname}</span>
				<p>{message.message}</p>
			</div>
        </li>
    );
};

export default Message;
