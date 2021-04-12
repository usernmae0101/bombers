import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink activeClassName="active" to="/">Лобби</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/profile/me">Профиль</NavLink>
                </li>
                <li>
                    <NavLink activeClassName="active" to="/rating">Рейтинг</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;