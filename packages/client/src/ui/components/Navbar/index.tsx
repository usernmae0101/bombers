import React from "react";
import { NavLink } from "react-router-dom";

import styles from "./navbar.module.scss";

const Navbar = () => {
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
                to="/profile/me"
            >Профиль</NavLink>

            <NavLink 
                className={styles.link}
                activeClassName={styles.active} 
                to="/rating"
            >Рейтинг</NavLink>
        </nav>
    );
};

export default Navbar;
