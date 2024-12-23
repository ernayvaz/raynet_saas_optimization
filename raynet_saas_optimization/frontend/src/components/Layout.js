// src/components/Layout.js

import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import LoadingSpinner from './LoadingSpinner';

const Navbar = React.lazy(() => import('./Navbar'));
const Footer = React.lazy(() => import('./Footer'));

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
`;

const Main = styled.main`
    flex: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
`;

const Layout = () => {
    return (
        <Container>
            <Suspense fallback={<LoadingSpinner />}>
                <Navbar />
                <Main>
                    <Outlet />
                </Main>
                <Footer />
            </Suspense>
        </Container>
    );
};

export default React.memo(Layout);
