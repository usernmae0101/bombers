import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./room-slots.module.scss";

type SlotPropsType = { 
    slot: Shared.Interfaces.IGameSlot; 
    color: number; 
};

const Slot: React.FC<SlotPropsType> = ({ slot, color }) => {
    return (
        <li className={styles.slot} data-color={color}>
            <img src={slot.user.avatar} />
            <span>{slot.user.nickname}</span>
            <span>{slot.user.rating}</span>
            <span>{!slot.isReady && "не"} готов</span>
        </li>
    );
};

const RoomSlots = () => {
    const slots = useSelector(GameSelectors.select_game_slots);

    return (
        <ul className={styles.slots}>
            {
                Object.keys(slots).map(color => {
                    return <Slot key={color} color={+color} slot={slots[+color]} />
                })
            }
        </ul>
    );
};

export default RoomSlots;