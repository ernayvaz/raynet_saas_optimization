// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ekstra CSS dosyası ekleyebilirsiniz

const Navbar = () => {
    return (
        <nav className="navbar">
            <h2 className="logo">Raynet SaaS Optimization</h2>
            <ul className="nav-links">
                <li>
                    <Link to="/" className="link">Dashboard</Link>
                </li>
                {/* Ekstra sayfalar için linkler ekleyebilirsiniz */}
                {/* <li>
                    <Link to="/about" className="link">About</Link>
                </li>
                <li>
                    <Link to="/contact" className="link">Contact</Link>
                </li> */}
            </ul>
        </nav>
    );
};

export default Navbar;
