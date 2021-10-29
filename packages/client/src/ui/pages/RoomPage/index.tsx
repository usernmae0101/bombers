import React from "react";
import Battle from "../../components/Battle";

import { RoutesPropsType } from "../../Routes";
import styles from "./room-page.module.scss";

const RoomPage: React.FC<RoutesPropsType> = ({ match }) => {
    return (
        <main className={styles.battle}>
            <Battle 
                address={match.params.address}
                port={match.params.port}
            />
        </main>
    );
}; 

export default RoomPage;
