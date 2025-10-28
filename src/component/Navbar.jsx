import React from "react";
import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { ThemeContext } from '../App'
import "./Navbar.css";
import { LABELS } from "../constants/labels";

const BRAND_NAME = "Avradav Revival";

const Navbar = () => {
    const [darkMode, setDarkMode] = React.useState(false);

    const toggleTheme = () => setDarkMode((prev) => !prev);

    const navbarClass = `navbar ${darkMode ? "dark" : "light"}`;
    const navLinks = [
        { path: "/foryou", label: "For You" }, // "foryou": Suppress unknown word warning
        { path: "/testimony", label: "Testimony" },
        { path: "/upload", label: "Upload" },
        { path: "/profile", label: "Profile" },
        { path: "/settings", label: "Settings" },
    ];
    
     <Link to="/terms">Terms</Link>

    return (
        <nav className={navbarClass}>
            <Link to="/">{BRAND_NAME}</Link>
            <ul className="nav-links">
                {navLinks.map((link, index) => (
                    <li key={index}>
                        <Link to={link.path}>{link.label}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={toggleTheme} className="theme-btn">
                {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
        </nav>
    );
};

export default Navbar;