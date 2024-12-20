// src/components/ErrorBoundary.js

import React from 'react';
import './ErrorBoundary.css'; // Ekstra CSS dosyası ekleyebilirsiniz

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Hata raporlama servisine gönderilebilir
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h1>Bir hata oluştu.</h1>
                    <p>Üzgünüz, bir şeyler yanlış gitti.</p>
                </div>
            );
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
