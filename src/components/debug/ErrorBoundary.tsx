import React, { Component, ReactNode } from 'react';
import { logger } from '../../lib/logger';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log del error
    logger.critical('React Error Boundary caught an error', {
      error: error.message,
      componentStack: errorInfo.componentStack,
      errorName: error.name,
      errorStack: error.stack
    });

    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  handleReport = () => {
    const errorReport = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // Copiar al portapapeles
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Reporte de error copiado al portapapeles'))
      .catch(() => console.error('Error al copiar'));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h1 className="error-boundary-title">¡Ups! Algo salió mal</h1>
            <p className="error-boundary-message">
              La aplicación ha encontrado un error inesperado. Nuestro equipo ha sido notificado.
            </p>

            <div className="error-boundary-details">
              <details>
                <summary>Detalles técnicos</summary>
                <div className="error-boundary-error">
                  <strong>Error:</strong>
                  <pre>{this.state.error?.message}</pre>
                </div>
                {this.state.error?.stack && (
                  <div className="error-boundary-stack">
                    <strong>Stack Trace:</strong>
                    <pre>{this.state.error.stack}</pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div className="error-boundary-component-stack">
                    <strong>Component Stack:</strong>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </div>
                )}
              </details>
            </div>

            <div className="error-boundary-actions">
              <button 
                onClick={this.handleReset}
                className="error-boundary-btn error-boundary-btn-primary"
              >
                🔄 Recargar Aplicación
              </button>
              <button 
                onClick={this.handleReport}
                className="error-boundary-btn error-boundary-btn-secondary"
              >
                📋 Copiar Reporte
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="error-boundary-btn error-boundary-btn-secondary"
              >
                🏠 Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
