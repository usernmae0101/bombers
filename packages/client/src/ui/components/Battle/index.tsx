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
import { startHandlingGameBattleSocket } from "../../../handlers/socket-game-battle-handler";
import * as GameActions from "../../redux/actions/game-actions";
import Keyboard from "../../../game/core/Keyboard";

type BattlePropsType = {
    address: string;
    port: string;
};

const Battle: React.FC<BattlePropsType> = ({ address, port }) => {
    const dispatch = useDispatch();

    const isLoading = useSelector(GameSelectors.select_game_loading);
    const userToken = useSelector(UserSelectors.select_user_auth_token);

    React.useEffect(() => {
        Keyboard.subscribe();

        const game = new Game;
   
        const gameSocketTCP = io(`http://${address}:${port}/battle`, {
            auth: {
                token: userToken
            }
        });

        dispatch(GameActions.action_game_set_tcp_socket(gameSocketTCP));

        const getPingIntervalAndUDPChann = startHandlingGameBattleSocket(
            userToken, address, game, gameSocketTCP, dispatch
        );

        return () => {
            Keyboard.unsubscribe();

            const [pingInterval, gameSocketUDP] = getPingIntervalAndUDPChann();
            
            gameSocketTCP.disconnect();
            gameSocketUDP.close();

            clearInterval(pingInterval);
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
