import React from "react";
import { useSelector } from "react-redux";

import * as Shared from "@bombers/shared/src/idnex";
import * as GameSelectors from "../../../redux/selectors/game-selectors";
import styles from "./slots.module.scss";

const Slot: React.FC<{ slot: Shared.Interfaces.IGameSlot; color: number; }> = ({ slot, color }) => {
    return (
        <li className={styles.slot} data-color={color}>
            <img src={slot.user.avatar} />
            <span>{slot.user.nickname}</span>
            <span>{slot.user.rating}</span>
        </li>
    );
};

const Slots = () => {
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

export default Slots;