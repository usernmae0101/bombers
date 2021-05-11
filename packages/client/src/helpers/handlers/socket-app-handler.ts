import { Dispatch } from "redux";
import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import * as DashboardActions from "../../ui/redux/actions/dashboard-actions";
import * as ChatActions from "../../ui/redux/actions/chat-actions";

export const startHandlingAppSocket = (socket: Socket, dispatch: Dispatch) => {
	// изменение онлайна
	socket.on(String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE), (online: number) => {
		dispatch(DashboardActions.action_dashboard_set_online(online));
    });
    
    // установка состояния (синхронизация при подключении)
	socket.on(String(Shared.Enums.SocketChannels.APP_ON_SET_STATE), (state: Shared.Interfaces.IServerAppState) => {
        dispatch(ChatActions.action_chat_set_messages(state.chat.messages));
    	dispatch(ChatActions.action_chat_set_members(state.chat.members));
    	dispatch(ChatActions.action_chat_set_ready(true));
    });

	// добавление игрового сервера в лобби
	socket.on(String(Shared.Enums.SocketChannels.APP_ON_ADD_GAME_SERVER), (server: Shared.Interfaces.ILobbyServer) => {

	});

	// добавление пользователя в список участников чата
	socket.on(String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MEMBER), (member: Shared.Interfaces.IUser) => {
		dispatch(ChatActions.action_chat_add_member(member));
	});
	
	// удаление пользователя из списка участников чата
	socket.on(String(Shared.Enums.SocketChannels.APP_ON_REMOVE_CHAT_MEMBER), (nickname: string) => {
		dispatch(ChatActions.action_chat_delete_member(nickname));
    });

	// добавление сообщения в чат
    socket.on(String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE), (message: Shared.Interfaces.IChatMessage) => {
		dispatch(ChatActions.action_chat_add_message(message));
	});
};
