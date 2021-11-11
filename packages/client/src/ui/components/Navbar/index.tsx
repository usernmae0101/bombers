import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./navbar.module.scss";
import * as UserSelecors from "@bombers/client/src/ui/redux/selectors/user-selecrots";

const Navbar = () => {
    const localUserNickname = useSelector(UserSelecors.select_user_data_nickname);

    return (
        <nav className={styles.wrapper}>
            <NavLink 
                className={styles.link}
                activeClassName={styles.active} 
                to="/"
                exact
            >Лобби</NavLink>

            <NavLink 
                className={styles.link}
                activeClassName={styles.active} 
                to={`/profile/${localUserNickname}`}
            >Профиль</NavLink>

            <NavLink 
                className={styles.link}
                activeClassName={styles.active} 
                to="/leaderboard"
            >Рейтинг</NavLink>
        </nav>
    );
};

export default Navbar;
