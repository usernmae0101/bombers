import { Dispatch } from "redux";
import { Socket } from "socket.io-client";

import * as Shared from "@bombers/shared/src/idnex";
import * as DashboardActions from "../ui/redux/actions/dashboard-actions";
import * as ChatActions from "../ui/redux/actions/chat-actions";
import * as LobbyActions from "../ui/redux/actions/lobby-actions";
import * as LobbyTypes from "../ui/redux/types/lobby-types";

type InitialStateType = {
	chat: Shared.Interfaces.IServerAppChat;
	online: number;
	totalServers: number;
};

export const startHandlingAppSocket = (socket: Socket, dispatch: Dispatch) => {
	// изменение онлайна
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_SET_ONLINE),
		(online: number) => {
			dispatch(DashboardActions.action_dashboard_set_online(online));
		}
	);

	// установка состояния (синхронизация при подключении)
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_SET_STATE), 
		(state: InitialStateType) => {
			dispatch(DashboardActions.action_dashboard_set_total_servers(state.totalServers));

			dispatch(ChatActions.action_chat_set_messages(state.chat.messages));
			dispatch(ChatActions.action_chat_set_members(state.chat.members));
			dispatch(ChatActions.action_chat_set_ready(true));
		}
	);

	// добавление пользователя в список участников чата
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MEMBER), 
		(member: Shared.Interfaces.IUser) => {
			dispatch(ChatActions.action_chat_add_member(member));
		}
	);

	// изменение количества игровых серверов
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_SET_GAME_SERVERS_COUNT), 
		(count: number) => {
			dispatch(DashboardActions.action_dashboard_set_total_servers(count));
		}
	);

	// удаление пользователя из списка участников чата
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_REMOVE_CHAT_MEMBER), 
		(nickname: string) => {
			dispatch(ChatActions.action_chat_delete_member(nickname));
		}
	);

	// получение части игровых серверов
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), 
		(servers: Shared.Interfaces.ILobbyServer[]) => {
			const lobbyServers: LobbyTypes.LobbyServerType[] = [];

			for (let server of servers)
				lobbyServers.push({ ...server, isConnected: false, room: null, ping: null });

			dispatch(LobbyActions.action_lobby_set_servers(lobbyServers));
			dispatch(LobbyActions.action_lobby_set_loading(false));
		}
	);

	// добавление сообщения в чат
	socket.on(
		String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE), 
		(message: Shared.Interfaces.IChatMessage) => {
			dispatch(ChatActions.action_chat_add_message(message));
		}
	);
};
