import { Client, Room } from "colyseus";

import * as Shared from "@bombers/shared/src/idnex";

interface IClinets {
    [sessionId: string]: {
        nickname: string;
    }
}

export default class ChatRoom extends Room<Shared.ChatState> {
    private _clients: IClinets = {};

    onCreate() {
        this.setState(new Shared.ChatState());

        this.onMessage(Shared.SocketChannels.CHAT_ON_MESSAGE, (client: Client, message: Shared.IMessage) => {
            this._addMessage(message);
        });
    }

    onJoin(client: Client, member: Shared.IMember) {
        this._clients[client.sessionId] = member;
        this._addMember(member);
        
        this.broadcast(Shared.SocketChannels.CHAT_ON_JOIN_MEMBER, member);
        this.presence.publish(String(Shared.SocketChannels.APP_ON_JOIN_CHAT), () => { });

        client.send(Shared.SocketChannels.CHAT_ON_SET_STATE, {
            messages: this.state.messages,
            members: this.state.members
        });
    }

    onLeave(client: Client) {
        this.broadcast(Shared.SocketChannels.CHAT_ON_LEAVE_MEMBER, this._clients[client.sessionId].nickname);
        this.presence.publish(String(Shared.SocketChannels.APP_ON_LEAVE_CHAT), () => { });

        this._removeMember(this._clients[client.sessionId].nickname);
        delete this._clients[client.sessionId];
    }

    private _addMessage(message: Shared.IMessage) {
        if (this.state.messages.length === Shared.SERVER_CHAT_MESSAGES_LIMIT)
            this.state.messages.shift();
        this.state.messages.push(new Shared.Message(message));
    }

    private _addMember(member: Shared.IMember) {
        this.state.members.push(new Shared.Member(member))
    }

    private _removeMember(nickname: string) {
        this.state.members = this.state.members.filter(member => member.nickname !== nickname);
    }
}
