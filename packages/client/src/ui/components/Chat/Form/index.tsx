import React from "react";
import { useSelector } from "react-redux";

import styles from "./form.module.scss";
import * as UserSelectors from "../../../redux/selectors/user-selecrots";

const Form = () => {
	const [message, setMessage] = React.useState("");

	const sendMessage = () => {
		if (!message) return;
		
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
