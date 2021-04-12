import React from "react";
import { useSelector } from "react-redux";
import { select_game_ping } from "../../../redux/selectors/game-selectors";

const HUD = () => {
    const ping = useSelector(select_game_ping);

    return (
        <div>
            <span>пинг: { ping }</span>
        </div>
    );
};

export default HUD;