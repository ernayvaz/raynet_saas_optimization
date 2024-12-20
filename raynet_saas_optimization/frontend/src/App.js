// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
    return (
        <Router>
            <ErrorBoundary>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        {/* Henüz oluşturulmamış sayfalar için örnek rotalar */}
                        {/* <Route path="/about" element={<About />} /> */}
                        {/* <Route path="/contact" element={<Contact />} /> */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </ErrorBoundary>
        </Router>
    );
}

export default App;
