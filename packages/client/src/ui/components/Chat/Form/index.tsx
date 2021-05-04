import React from "react";

import styles from "./form.module.scss";

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
