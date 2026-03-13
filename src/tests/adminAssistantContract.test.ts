import { describe, expect, it } from 'vitest';
import {
  buildAdminAssistantRequest,
  createPendingAssistantResponse,
  getAdminAssistantSuggestions,
  normalizeAdminAssistantResponse,
} from '../features/adminAssistant/adminAssistantContract';

describe('adminAssistantContract', () => {
  it('builds a normalized assistant request payload', () => {
    const payload = buildAdminAssistantRequest('  Ventas del mes por vendedor  ', 'session-1');

    expect(payload.message).toBe('Ventas del mes por vendedor');
    expect(payload.sessionId).toBe('session-1');
  });

  it('provides curated suggestions for the admin assistant', () => {
    const suggestions = getAdminAssistantSuggestions();

    expect(suggestions.length).toBeGreaterThanOrEqual(4);
    expect(new Set(suggestions.map((suggestion) => suggestion.id)).size).toBe(suggestions.length);
    expect(suggestions.every((suggestion) => suggestion.prompt.trim().length > 0)).toBe(true);
  });

  it('creates a backend pending response for the UI placeholder state', () => {
    const response = createPendingAssistantResponse('Clientes sin compra en 60 días');

    expect(response.table.rows[0].valor_esperado).toContain('Clientes sin compra en 60 días');
    expect(response.meta.status).toBe('backend_pending');
    expect(response.answer).toContain('backend');
  });

  it('normalizes backend responses when table data is missing', () => {
    const response = normalizeAdminAssistantResponse({
      answer: 'Sin tabla',
      meta: {
        requestId: 'req-1',
      },
    });

    expect(response.answer).toBe('Sin tabla');
    expect(response.table.columns).toEqual([]);
    expect(response.table.rows).toEqual([]);
    expect(response.meta.requestId).toBe('req-1');
  });
});
