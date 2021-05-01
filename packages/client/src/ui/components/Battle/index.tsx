import React from "react";
import { useDispatch, useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import styles from "./battle.module.scss";
import Loader from "../Loader";
import Bar from "./Bar";
import Slots from "./Slots";
import GameComponent from "./Game";
import HUD from "./HUD";

const Battle: React.FC<{ id: string; }> = ({ id }) => {
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        
    }, []);

    if (isLoading) return <Loader />

    return (
        <div className={styles.battle}>
            <Bar />
            <Slots />
            <GameComponent />
            <HUD />
        </div>
    );
};

export default Battle;