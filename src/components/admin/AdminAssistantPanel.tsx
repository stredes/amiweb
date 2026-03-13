import { FormEvent, useState } from 'react';
import {
  AdminAssistantMessage,
  AdminAssistantUserRole,
  AdminAssistantQueryRequest,
  buildAdminAssistantRequest,
  createPendingAssistantResponse,
  getAdminAssistantSuggestions,
} from '../../features/adminAssistant/adminAssistantContract';

interface AdminAssistantPanelProps {
  userName: string;
  userRole: AdminAssistantUserRole;
}

function createAssistantMessage(content: string): AdminAssistantMessage {
  return {
    id: `assistant-${crypto.randomUUID()}`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
  };
}

function createUserMessage(content: string): AdminAssistantMessage {
  return {
    id: `user-${crypto.randomUUID()}`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  };
}

export function AdminAssistantPanel({ userName, userRole }: AdminAssistantPanelProps) {
  const [draft, setDraft] = useState('');
  const initialQuestion = 'Ventas del mes por vendedor';
  const [messages, setMessages] = useState<AdminAssistantMessage[]>([
    createAssistantMessage(
      `Hola ${userName}. Este asistente ya esta preparado en frontend para consultas administrativas, pero aun espera la conexion del backend.`
    ),
  ]);
  const [lastRequest, setLastRequest] = useState<AdminAssistantQueryRequest | null>(() =>
    buildAdminAssistantRequest(initialQuestion, userRole)
  );
  const [lastResponsePreview, setLastResponsePreview] = useState(() =>
    createPendingAssistantResponse(initialQuestion)
  );

  const suggestions = getAdminAssistantSuggestions();

  const submitQuestion = (question: string) => {
    const normalizedQuestion = question.trim();
    if (!normalizedQuestion) return;

    const request = buildAdminAssistantRequest(normalizedQuestion, userRole);
    const responsePreview = createPendingAssistantResponse(normalizedQuestion);

    setMessages((currentMessages) => [
      ...currentMessages,
      createUserMessage(normalizedQuestion),
      createAssistantMessage(responsePreview.answer),
    ]);
    setLastRequest(request);
    setLastResponsePreview(responsePreview);
    setDraft('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitQuestion(draft);
  };

  return (
    <section className="admin-section admin-assistant-panel">
      <div className="admin-assistant-panel__header">
        <div>
          <span className="admin-assistant-panel__eyebrow">Asistente Admin</span>
          <h2>Consultas guiadas con IA</h2>
          <p className="muted">
            Interfaz lista para backend. El admin podra consultar ventas, cartera, pedidos e
            inventario en lenguaje natural sin escribir SQL.
          </p>
        </div>
        <div className="admin-assistant-panel__status">
          <span className="admin-assistant-panel__status-dot" />
          Esperando backend
        </div>
      </div>

      <div className="admin-assistant-layout">
        <div className="admin-assistant-chat">
          <div className="admin-assistant-suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className="admin-assistant-suggestion"
                onClick={() => submitQuestion(suggestion.prompt)}
              >
                <span>{suggestion.icon}</span>
                {suggestion.label}
              </button>
            ))}
          </div>

          <div className="admin-assistant-thread">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`admin-assistant-message admin-assistant-message--${message.role}`}
              >
                <div className="admin-assistant-message__meta">
                  <strong>{message.role === 'assistant' ? 'Asistente' : 'Admin'}</strong>
                  <span>{new Date(message.timestamp).toLocaleTimeString('es-CL')}</span>
                </div>
                <p>{message.content}</p>
              </article>
            ))}
          </div>

          <form className="admin-assistant-composer" onSubmit={handleSubmit}>
            <label htmlFor="admin-assistant-input">Consulta administrativa</label>
            <textarea
              id="admin-assistant-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ej: Quiero ver clientes sin compra en 90 dias y el vendedor asignado."
              rows={4}
            />
            <div className="admin-assistant-composer__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setDraft('')}
                disabled={!draft.trim()}
              >
                Limpiar borrador
              </button>
              <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
                Preparar consulta
              </button>
            </div>
          </form>
        </div>

        <aside className="admin-assistant-sidepanel">
          <article className="admin-assistant-card">
            <h3>Capacidades previstas</h3>
            <ul>
              <li>Ventas por periodo, vendedor o cliente.</li>
              <li>Pedidos por estado, aprobacion o atraso.</li>
              <li>Cartera comercial y clientes inactivos.</li>
              <li>Inventario, rotacion y alertas operativas.</li>
            </ul>
          </article>

          <article className="admin-assistant-card">
            <h3>Contrato listo para backend</h3>
            <p>
              El frontend ya prepara `question`, `scope`, `userRole`, `page` y `requestedAt`.
            </p>
            <pre>{JSON.stringify(lastRequest, null, 2)}</pre>
          </article>

          <article className="admin-assistant-card">
            <h3>Vista esperada de respuesta</h3>
            <p>{lastResponsePreview.queryLabel}</p>
            <div className="admin-assistant-table">
              <div className="admin-assistant-table__head">
                {lastResponsePreview.columns.map((column) => (
                  <span key={column}>{column}</span>
                ))}
              </div>
              {lastResponsePreview.rows.map((row, index) => (
                <div key={`${row.campo}-${index}`} className="admin-assistant-table__row">
                  {lastResponsePreview.columns.map((column) => (
                    <span key={column}>{String(row[column] ?? '-')}</span>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
