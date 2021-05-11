import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import { select_user_socket_instance } from "./../../../redux/selectors/user-selecrots";
import styles from "./form.module.scss";

const Form = () => {
	const [message, setMessage] = React.useState("");

	const socket = useSelector(select_user_socket_instance);

	const sendMessage = () => {
		if (!message) return;
		
		socket.emit(
			String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE), 
			message.slice(0, Shared.Constants.CHAT_MAX_MESSAGE_LENGTH)
		);

		setMessage("");
	};

	return (
		<div className={styles.form}>
			<input value={message} onChange={e => setMessage(e.target.value)} type="text" />
			<button onClick={sendMessage}>send</button>
		</div>
	);
};

export default Form;
