import React from "react";
import { useSelector } from "react-redux";

import imgRating from "@bombers/client/assets/images/rating.png";
import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./room-slots.module.scss";

type SlotPropsType = { 
    slot: Shared.Interfaces.IGameSlot; 
    color: number; 
    isGameStarted: boolean;
};

const Slot: React.FC<SlotPropsType> = ({ slot, color, isGameStarted }) => {
    return (
        <div 
            className={styles.slot} 
            data-color={color}
        >
            <div className={styles.wrapper}>
                <div className={styles.avatar}>
                    <img src={slot.user.avatar} />
                </div>

                <div className={styles.rating}>
                    <img src={imgRating} />
                    <div>{slot.user.rating}</div>
                </div>

                <div 
                    className={styles.nickname}
                    title={slot.user.nickname}
                >
                    {slot.user.nickname}
                </div>

                { 
                    slot.isReady && !isGameStarted &&

                    <div className={styles.ready}>
                        <div className={styles.triangle}></div>
                        <div className={styles.label}>Готов</div>
                    </div>
                }
            </div>
        </div>
    );
};

const RoomSlots = () => {
    const slots = useSelector(GameSelectors.select_game_slots);
    const isGameStarted = useSelector(GameSelectors.select_is_game_started);

    return (
        <div className={styles.slots}>
            {
                Object.keys(slots).map(color => {
                    return <Slot 
                                key={color} 
                                color={+color} 
                                slot={slots[+color]} 
                                isGameStarted={isGameStarted}
                            />
                })
            }
        </div>
    );
};

export default RoomSlots;
