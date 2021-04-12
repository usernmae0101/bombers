import React from "react";
import { SocketChannels } from "@bombers/shared/src/idnex";

import styles from "./form.module.scss";
import { Room } from "colyseus.js";
import { useSelector } from "react-redux";
import { select_user_data_avatar, select_user_data_nickname } from "../../../redux/selectors/user-selecrots";

const Form: React.FC<{
	chatRoom: Room;
}> = ({ chatRoom }) => {
	const [message, setMessage] = React.useState("");
	
	const avatar = useSelector(select_user_data_avatar);
	const nickname = useSelector(select_user_data_nickname);

	const sendMessage = () => {
		if (!message) return;

		chatRoom.send(SocketChannels.CHAT_ON_MESSAGE, {
			avatar,
			message,
			author: nickname,
			date: Date.now()
		});
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
