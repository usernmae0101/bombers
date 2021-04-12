import React from "react";
import { useSelector } from "react-redux";

import { ISlot } from "@bombers/shared/src/idnex";
import { select_game_slots } from "../../../redux/selectors/game-selectors";

const Slot: React.FC<{ slot: ISlot; color: number; }> = ({ slot, color }) => {
    return (
        <li data-color={color}>
            <div>
                <img src={slot.avatar} />
            </div>
            <div>
                <span>{slot.nickname}</span>
            </div>
            <div>
                <span>{slot.rating}</span>
            </div>
        </li>
    );
};

const Slots = () => {
    const slots = useSelector(select_game_slots);

    return (
        <ul>
            { Object.keys(slots).map(color => <Slot key={color} color={+color} slot={slots[+color]} />)}
        </ul>
    );
};

export default Slots;