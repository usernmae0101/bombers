import React from "react";
import { useSelector } from "react-redux";

import { ISlot } from "@bombers/shared/src/idnex";
import { select_game_slots } from "../../../redux/selectors/game-selectors";
import styles from "./slots.module.scss";

const Slot: React.FC<{ slot: ISlot; color: number; }> = ({ slot, color }) => {
    return (
        <li className={styles.slot} data-color={color}>
            <img src={slot.avatar} />
            <span>{slot.nickname}</span>
            <span>{slot.rating}</span>
        </li>
    );
};

const Slots = () => {
    const slots = useSelector(select_game_slots);

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

export default Slots;