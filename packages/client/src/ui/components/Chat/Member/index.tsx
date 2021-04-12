import React from "react";

import { ChatMemberType } from "../../../redux/types/chat-types";

const Member: React.FC<{ member: ChatMemberType }> = ({ member }) => {
    return (
        <li>
            <span>{ member.nickname }</span>
        </li>
    );
};

export default Member;