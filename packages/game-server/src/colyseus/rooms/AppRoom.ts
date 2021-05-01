import { Room } from "colyseus";

import { AppState, SocketChannels} from "@bombers/shared/src/idnex";

interface IClients {
    [sessionId: string]: {
        nickname: string;
        isPlaying: boolean;
        isChatting: boolean;
    }
}

export default class AppRoom  extends Room<AppState> {
    onCreate() {
        this.setState(new AppState());

        this.presence.subscribe(String(SocketChannels.APP_ON_JOIN_CHAT), (_: any) => {
            this._increaseOnlinseChat();
            this._broadcastOnline();
        });

        this.presence.subscribe(String(SocketChannels.APP_ON_JOIN_GAME), (_: any) => {
            this._increaseOnlineGame();
            this._broadcastOnline();
        });

        this.presence.subscribe(String(SocketChannels.APP_ON_LEAVE_CHAT), (_: any) => {
            this._decreaseOnlineChat();
            this._broadcastOnline();
        });

        this.presence.subscribe(String(SocketChannels.APP_ON_LEAVE_GAME), (_: any) => {
            this._decreaseOnlineGame();
            this._broadcastOnline();
        });
    }

    private _broadcastOnline() {
        this.broadcast(SocketChannels.APP_ON_SET_ONLINE, {
            game: this.state.online.game,
            chat: this.state.online.chat
        });
    }

    private _increaseOnlineGame() {
        ++this.state.online.game;
    }

    private _increaseOnlinseChat() {
        ++this.state.online.chat;
    }

    private _decreaseOnlineGame() {
        --this.state.online.game;
    }

    private _decreaseOnlineChat() {
        --this.state.online.chat;
    }
}
