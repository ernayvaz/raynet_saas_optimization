// src/components/Navbar.js

import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavLinks = styled.div`
    display: flex;
    gap: 1rem;

    @media (max-width: 768px) {
        display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
        flex-direction: column;
        position: absolute;
        top: 60px;
        right: 0;
        background: #fff;
        width: 200px;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
`;

const StyledNavLink = styled(NavLink)`
    text-decoration: none;
    color: #333;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;

    &.active {
        background-color: #f0f0f0;
    }

    &:hover {
        background-color: #e0e0e0;
    }
`;

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);

    return (
        <Nav>
            <h1>Raynet SaaS</h1>
            <NavLinks isOpen={isOpen}>
                <StyledNavLink to="/" end>
                    Dashboard
                </StyledNavLink>
                {/* Diğer linkler */}
            </NavLinks>
        </Nav>
    );
};

export default React.memo(Navbar);
