// src/components/ErrorBoundary.js

import React from 'react';
import * as Sentry from "@sentry/react";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-XXXXXXXXX-X');

class ErrorBoundary extends React.Component {
    state = { 
        hasError: false,
        errorInfo: null,
        eventId: null
    };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        
        // Sentry entegrasyonu
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            const eventId = Sentry.captureException(error);
            this.setState({ eventId });
        });

        // Analytics
        if (process.env.NODE_ENV === 'production') {
            // Google Analytics veya benzeri
            ReactGA.event({
                category: 'Error',
                action: 'Error Occurred',
                label: error.toString(),
                value: errorInfo.componentStack
            });
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h1>An unexpected error occurred</h1>
                    <button onClick={this.handleReload}>
                        Sayfayı Yenile
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.errorInfo?.componentStack}
                        </details>
                    )}
                </div>
            );
        }
        return this.props.children;
    }
}

export default Sentry.withErrorBoundary(ErrorBoundary);
