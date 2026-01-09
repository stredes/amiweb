import { analytics } from './firebase';
import { logEvent as firebaseLogEvent } from 'firebase/analytics';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Máximo de logs en memoria
  private sessionId: string;
  private userId?: string;
  private isProduction: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isProduction = import.meta.env.PROD;
    this.initErrorHandlers();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  clearUserId() {
    this.userId = undefined;
  }

  private initErrorHandlers() {
    // Captura errores globales de JavaScript
    window.addEventListener('error', (event) => {
      this.error('Uncaught Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    // Captura promesas rechazadas sin catch
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: String(event.promise)
      });
    });

    // Captura errores de red
    window.addEventListener('offline', () => {
      this.warn('Network offline');
    });

    window.addEventListener('online', () => {
      this.info('Network online');
    });
  }

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      stack: error?.stack,
      userId: this.userId,
      sessionId: this.sessionId
    };
  }

  private storeLog(entry: LogEntry) {
    this.logs.push(entry);
    
    // Mantener solo los últimos maxLogs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Guardar en localStorage para persistencia
    try {
      const recentLogs = this.logs.slice(-100); // Solo últimos 100
      localStorage.setItem('app_logs', JSON.stringify(recentLogs));
    } catch (e) {
      // Si falla localStorage, continuar sin guardar
    }
  }

  private sendToConsole(entry: LogEntry) {
    const style = this.getConsoleStyle(entry.level);
    const prefix = `[${entry.level.toUpperCase()}] [${new Date(entry.timestamp).toLocaleTimeString()}]`;
    
    if (!this.isProduction || entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL) {
      switch (entry.level) {
        case LogLevel.DEBUG:
        case LogLevel.INFO:
          console.log(`%c${prefix}`, style, entry.message, entry.context || '');
          break;
        case LogLevel.WARN:
          console.warn(`%c${prefix}`, style, entry.message, entry.context || '');
          break;
        case LogLevel.ERROR:
        case LogLevel.CRITICAL:
          console.error(`%c${prefix}`, style, entry.message, entry.context || '');
          if (entry.stack) {
            console.error(entry.stack);
          }
          break;
      }
    }
  }

  private getConsoleStyle(level: LogLevel): string {
    const styles = {
      [LogLevel.DEBUG]: 'color: #808080',
      [LogLevel.INFO]: 'color: #0066cc',
      [LogLevel.WARN]: 'color: #ff8c00; font-weight: bold',
      [LogLevel.ERROR]: 'color: #ff0000; font-weight: bold',
      [LogLevel.CRITICAL]: 'color: #ffffff; background-color: #ff0000; font-weight: bold; padding: 2px 4px'
    };
    return styles[level];
  }

  private sendToFirebaseAnalytics(entry: LogEntry) {
    if (!analytics || !this.isProduction) return;

    try {
      // Solo enviar eventos importantes a Firebase
      if (entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL) {
        firebaseLogEvent(analytics, 'error_occurred', {
          error_message: entry.message,
          error_level: entry.level,
          user_id: entry.userId,
          session_id: entry.sessionId,
          ...entry.context
        });
      }
    } catch (e) {
      // Fallo silencioso en analytics
    }
  }

  debug(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.storeLog(entry);
    this.sendToConsole(entry);
  }

  error(message: string, contextOrError?: Record<string, any> | Error, error?: Error) {
    let context: Record<string, any> | undefined;
    let err: Error | undefined;

    if (contextOrError instanceof Error) {
      err = contextOrError;
      context = { errorName: err.name, errorMessage: err.message };
    } else {
      context = contextOrError;
      err = error;
    }

    const entry = this.createLogEntry(LogLevel.ERROR, message, context, err);
    this.storeLog(entry);
    this.sendToConsole(entry);
    this.sendToFirebaseAnalytics(entry);
  }

  critical(message: string, contextOrError?: Record<string, any> | Error, error?: Error) {
    let context: Record<string, any> | undefined;
    let err: Error | undefined;

    if (contextOrError instanceof Error) {
      err = contextOrError;
      context = { errorName: err.name, errorMessage: err.message };
    } else {
      context = contextOrError;
      err = error;
    }

    const entry = this.createLogEntry(LogLevel.CRITICAL, message, context, err);
    this.storeLog(entry);
    this.sendToConsole(entry);
    this.sendToFirebaseAnalytics(entry);
  }

  // Eventos personalizados para Firebase Analytics
  logEvent(eventName: string, params?: Record<string, any>) {
    if (analytics) {
      try {
        firebaseLogEvent(analytics, eventName, params);
        this.debug(`Analytics event: ${eventName}`, params);
      } catch (e) {
        this.error('Failed to log analytics event', { eventName, error: String(e) });
      }
    }
  }

  // Obtener todos los logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  // Exportar logs como JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Limpiar logs
  clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem('app_logs');
    } catch (e) {
      // Ignorar errores
    }
    this.info('Logs cleared');
  }

  // Obtener estadísticas de logs
  getStats() {
    const stats = {
      total: this.logs.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      critical: 0
    };

    this.logs.forEach(log => {
      stats[log.level]++;
    });

    return stats;
  }

  // Cargar logs desde localStorage
  loadStoredLogs() {
    try {
      const stored = localStorage.getItem('app_logs');
      if (stored) {
        const logs = JSON.parse(stored) as LogEntry[];
        this.logs = [...logs, ...this.logs];
        this.info('Loaded stored logs', { count: logs.length });
      }
    } catch (e) {
      this.error('Failed to load stored logs', e as Error);
    }
  }
}

// Instancia singleton
export const logger = new Logger();

// Cargar logs almacenados al iniciar
logger.loadStoredLogs();

// Log inicial
logger.info('Logger initialized', {
  environment: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0'
});
