import { useState, useEffect } from 'react';
import { logger, LogLevel, LogEntry } from '../../lib/logger';
import './LogViewer.css';

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'all'>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const updateLogs = () => {
      const allLogs = logger.getLogs();
      setLogs(allLogs);
    };

    updateLogs();
    const interval = setInterval(updateLogs, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.level === filter;
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.context).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }).reverse(); // Más recientes primero

  const stats = logger.getStats();

  const handleExport = () => {
    const data = logger.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
      logger.clearLogs();
      setLogs([]);
    }
  };

  const getLevelColor = (level: LogLevel) => {
    const colors = {
      [LogLevel.DEBUG]: '#808080',
      [LogLevel.INFO]: '#0066cc',
      [LogLevel.WARN]: '#ff8c00',
      [LogLevel.ERROR]: '#ff0000',
      [LogLevel.CRITICAL]: '#8b0000'
    };
    return colors[level];
  };

  if (!isExpanded) {
    return (
      <div className="log-viewer-collapsed">
        <button 
          onClick={() => setIsExpanded(true)}
          className="log-viewer-toggle"
          title="Abrir visor de logs"
        >
          📋 Logs ({logs.length})
          {stats.error + stats.critical > 0 && (
            <span className="log-viewer-error-badge">
              {stats.error + stats.critical}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="log-viewer-container">
      <div className="log-viewer-header">
        <h3>📋 Visor de Logs</h3>
        <button 
          onClick={() => setIsExpanded(false)}
          className="log-viewer-close"
        >
          ✕
        </button>
      </div>

      <div className="log-viewer-controls">
        <div className="log-viewer-stats">
          <span className="log-stat">Total: {stats.total}</span>
          <span className="log-stat" style={{ color: getLevelColor(LogLevel.DEBUG) }}>
            Debug: {stats.debug}
          </span>
          <span className="log-stat" style={{ color: getLevelColor(LogLevel.INFO) }}>
            Info: {stats.info}
          </span>
          <span className="log-stat" style={{ color: getLevelColor(LogLevel.WARN) }}>
            Warn: {stats.warn}
          </span>
          <span className="log-stat" style={{ color: getLevelColor(LogLevel.ERROR) }}>
            Error: {stats.error}
          </span>
          <span className="log-stat" style={{ color: getLevelColor(LogLevel.CRITICAL) }}>
            Critical: {stats.critical}
          </span>
        </div>

        <div className="log-viewer-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as LogLevel | 'all')}
            className="log-filter-select"
          >
            <option value="all">Todos los niveles</option>
            <option value={LogLevel.DEBUG}>Debug</option>
            <option value={LogLevel.INFO}>Info</option>
            <option value={LogLevel.WARN}>Warn</option>
            <option value={LogLevel.ERROR}>Error</option>
            <option value={LogLevel.CRITICAL}>Critical</option>
          </select>

          <input
            type="text"
            placeholder="Buscar en logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="log-search-input"
          />
        </div>

        <div className="log-viewer-actions">
          <button onClick={handleExport} className="log-action-btn">
            💾 Exportar
          </button>
          <button onClick={handleClear} className="log-action-btn log-clear-btn">
            🗑️ Limpiar
          </button>
        </div>
      </div>

      <div className="log-viewer-content">
        {filteredLogs.length === 0 ? (
          <div className="log-empty">
            No hay logs para mostrar
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <LogEntryComponent key={index} log={log} />
          ))
        )}
      </div>
    </div>
  );
}

function LogEntryComponent({ log }: { log: LogEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLevelColor = (level: LogLevel) => {
    const colors = {
      [LogLevel.DEBUG]: '#808080',
      [LogLevel.INFO]: '#0066cc',
      [LogLevel.WARN]: '#ff8c00',
      [LogLevel.ERROR]: '#ff0000',
      [LogLevel.CRITICAL]: '#8b0000'
    };
    return colors[level];
  };

  const time = new Date(log.timestamp).toLocaleTimeString();
  const hasDetails = log.context || log.stack;

  return (
    <div 
      className={`log-entry log-entry-${log.level}`}
      style={{ borderLeftColor: getLevelColor(log.level) }}
    >
      <div className="log-entry-header" onClick={() => hasDetails && setIsExpanded(!isExpanded)}>
        <span className="log-entry-time">{time}</span>
        <span 
          className="log-entry-level"
          style={{ backgroundColor: getLevelColor(log.level) }}
        >
          {log.level.toUpperCase()}
        </span>
        <span className="log-entry-message">{log.message}</span>
        {hasDetails && (
          <span className="log-entry-expand">{isExpanded ? '▼' : '▶'}</span>
        )}
      </div>

      {isExpanded && (
        <div className="log-entry-details">
          {log.context && (
            <div className="log-entry-context">
              <strong>Contexto:</strong>
              <pre>{JSON.stringify(log.context, null, 2)}</pre>
            </div>
          )}
          {log.stack && (
            <div className="log-entry-stack">
              <strong>Stack Trace:</strong>
              <pre>{log.stack}</pre>
            </div>
          )}
          {log.userId && (
            <div className="log-entry-meta">
              <strong>User ID:</strong> {log.userId}
            </div>
          )}
          <div className="log-entry-meta">
            <strong>Session ID:</strong> {log.sessionId}
          </div>
        </div>
      )}
    </div>
  );
}
