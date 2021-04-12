import { Client, Room } from "colyseus";

import {
    ChatState, IMember, IMessage, Member, Message,
    SERVER_CHAT_MESSAGES_LIMIT, SocketChannels
} from "@bombers/shared/src/idnex";

interface IClinets {
    [sessionId: string]: {
        nickname: string;
    }
}

export default class ChatRoom extends Room<ChatState> {
    private _clients: IClinets = {};

    onCreate() {
        this.setState(new ChatState());

        this.onMessage(SocketChannels.CHAT_ON_MESSAGE, (client: Client, message: IMessage) => {
            this._addMessage(message);
        });
    }

    onJoin(client: Client, member: IMember) {
        this._clients[client.sessionId] = member;
        this._addMember(member);
        
        this.broadcast(SocketChannels.CHAT_ON_JOIN_MEMBER, member);
        this.presence.publish(String(SocketChannels.APP_ON_JOIN_CHAT), () => { });

        client.send(SocketChannels.CHAT_ON_SET_STATE, {
            messages: this.state.messages,
            members: this.state.members
        });
    }

    onLeave(client: Client) {
        this.broadcast(SocketChannels.CHAT_ON_LEAVE_MEMBER, this._clients[client.sessionId].nickname);
        this.presence.publish(String(SocketChannels.APP_ON_LEAVE_CHAT), () => { });

        this._removeMember(this._clients[client.sessionId].nickname);
        delete this._clients[client.sessionId];
    }

    private _addMessage(message: IMessage) {
        if (this.state.messages.length === SERVER_CHAT_MESSAGES_LIMIT)
            this.state.messages.shift();
        this.state.messages.push(new Message(message));
    }

    private _addMember(member: IMember) {
        this.state.members.push(new Member(member))
    }

    private _removeMember(nickname: string) {
        this.state.members = this.state.members.filter(member => member.nickname !== nickname);
    }
}
