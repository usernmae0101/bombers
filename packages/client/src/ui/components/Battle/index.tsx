import React from "react";
import { io } from "socket.io-client";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./battle.module.scss";
import Loader from "../Loader";
import RoomBar from "./RoomBar";
import RoomSlots from "./RoomSlots";
import GameContainer from "./GameContainer";
import GameHUD from "./GameHUD";
import * as Shared from "@bombers/shared/src/idnex";
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

    const [battleResult, setBattleResult] = React.useState([] as any[]);
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
            userToken, 
            address, 
            game, 
            gameSocketTCP, 
            dispatch,
            setBattleResult
        );

        return () => {
            Keyboard.unsubscribe();

            const [pingInterval, gameSocketUDP] = getPingIntervalAndUDPChann();
            
            gameSocketTCP && gameSocketTCP.disconnect();
            gameSocketUDP && gameSocketUDP.close();

            clearInterval(pingInterval);
        };
    }, []);

    if (isLoading) 
        return <Loader />;

    if (battleResult.length)
        return <Redirect 
            to={{
                pathname: "/",
                state: { battleResult }
            }} 
        />

    return (
        <div className={styles.battle}>
            <RoomBar />
            <RoomSlots />
            <GameContainer />
            <GameHUD />
        </div>
    );
};

export default Battle;
