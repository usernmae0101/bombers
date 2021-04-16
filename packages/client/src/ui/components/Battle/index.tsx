import { Room } from "colyseus.js";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import Inputs from "../../../game/core/Inputs";
import * as UserSelectors from "../../redux/selectors/user-selecrots";
import { Game } from "../../../game/Game";
import styles from "./battle.module.scss";
import Menu from "./Menu";
import Loader from "../Loader";
import { action_user_set_socket_battle_room } from "../../redux/actions/user-actions";
import HUD from "./HUD";
import { action_game_set_instance, action_game_set_slots } from "../../redux/actions/game-actions";
import Slots from "./Slots";

const Battle: React.FC<{ id: string; }> = ({ id }) => {
    const dispatch = useDispatch();

    const nickname = useSelector(UserSelectors.select_user_data_nickname);
    const rating = useSelector(UserSelectors.select_user_data_rating);
    const avatar = useSelector(UserSelectors.select_user_data_avatar);
    const socket = useSelector(UserSelectors.select_user_socket_instance);

    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let room: Room<Shared.GameState>;

        Inputs.subscribe();

        (async () => {
            const game = new Game;

            room = await socket.joinById(id, { nickname, rating, avatar });

            game.room = room;
            game.dispatch = dispatch;
            game.startPing();

            room.onStateChange.once(state => {
                game.players = state.plyaers.toJSON();
                game.map = Shared.normalizeMap(state.map.toJSON());

                room.onMessage(Shared.SocketChannels.BATTLE_ON_PONG, game.onPong);
                room.onMessage(Shared.SocketChannels.BATTLE_ON_RUN_GAME, _ => game.run());
                room.onMessage(Shared.SocketChannels.BATTLE_ON_SET_INIT_DATA, data => game.init(data));
                room.onMessage(Shared.SocketChannels.BATTLE_ON_UPDATE_SLOTS, (slots: Shared.ISlots) => {
                    dispatch(action_game_set_slots(slots));
                });

                setIsLoading(false);
            });

            room.state.plyaers.onAdd = game.onAddPlayer;
            room.state.plyaers.onRemove = game.onRemovePlayer;
            room.state.map.onChange = game.onMapChange;

            dispatch(action_game_set_instance(game));
            dispatch(action_user_set_socket_battle_room(room));
        })();

        return () => {
            room && room.leave();

            Inputs.unsubscribe();
        };
    }, []);

    if (isLoading) return <Loader />

    return (
        <div className={styles.battle}>
            <div className={styles.slots}>
                <Slots />
            </div>
            <div className={styles.canvas__container} id="cnv">
                <div className={styles.menu}>
                    <Menu />
                </div>
            </div>
            <div className={styles.HUD}>
                <HUD />
            </div>
        </div>
    );
};

export default Battle;