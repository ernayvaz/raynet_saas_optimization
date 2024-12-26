// src/components/Navbar.js

import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Nav = styled.nav`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
`;

const NavContent = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const NavLinks = styled.div`
    display: flex;
    gap: 1rem;
`;

const StyledNavLink = styled(NavLink)`
    color: #333;
    text-decoration: none;
    padding: 0.5rem;
    border-radius: 4px;

    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    &.active {
        color: #0052CC;
        background: rgba(0, 82, 204, 0.1);
    }
`;

const Navbar = () => {
    return (
        <Nav>
            <NavContent>
                <NavLinks>
                    <StyledNavLink to="/" end>
                        Dashboard
                    </StyledNavLink>
                </NavLinks>
            </NavContent>
        </Nav>
    );
};

export default React.memo(Navbar);
