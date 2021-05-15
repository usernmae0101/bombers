import React from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import styles from "./battle.module.scss";
import Loader from "../Loader";
import Bar from "./Bar";
import Slots from "./Slots";
import GameComponent from "./Game";
import HUD from "./HUD";
import * as GameSelectors from "../../redux/selectors/game-selectors";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import Game from "../../../game/Game";
import { startHandlingGameBattleSocket } from "../../../helpers/handlers/socket-game-battle-handler";

type BattlePropsType = {
    address: string;
    port: string;
};

const Battle: React.FC<BattlePropsType> = ({ address, port }) => {
    const dispatch = useDispatch();

    const isLoading = useSelector(GameSelectors.select_game_loading);
    const userToken = useSelector(UserSelectors.select_user_auth_token);

    React.useEffect(() => {
        const game = new Game;

        const gameSocketTCP = io(`http://${address}:${port}/battle`, {
            query: {
                token: userToken
            }
        });
        // замыкаем setInterval, чтобы престать пинговать сервер при демонтировании компонета
        const getPingInterval = startHandlingGameBattleSocket(game, gameSocketTCP, dispatch);

        game.TCPChann = gameSocketTCP;

        return () => {
            gameSocketTCP.disconnect();
            clearInterval(getPingInterval());
        };
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