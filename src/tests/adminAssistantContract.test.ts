import { describe, expect, it } from 'vitest';
import {
  buildAdminAssistantRequest,
  createPendingAssistantResponse,
  getAdminAssistantSuggestions,
} from '../features/adminAssistant/adminAssistantContract';

describe('adminAssistantContract', () => {
  it('builds a normalized assistant request payload', () => {
    const payload = buildAdminAssistantRequest('  Ventas del mes por vendedor  ', 'admin');

    expect(payload.question).toBe('Ventas del mes por vendedor');
    expect(payload.context.scope).toBe('admin');
    expect(payload.context.userRole).toBe('admin');
    expect(payload.context.page).toBe('admin-dashboard');
    expect(payload.context.requestedAt).toBeTruthy();
  });

  it('provides curated suggestions for the admin assistant', () => {
    const suggestions = getAdminAssistantSuggestions();

    expect(suggestions.length).toBeGreaterThanOrEqual(4);
    expect(new Set(suggestions.map((suggestion) => suggestion.id)).size).toBe(suggestions.length);
    expect(suggestions.every((suggestion) => suggestion.prompt.trim().length > 0)).toBe(true);
  });

  it('creates a backend pending response for the UI placeholder state', () => {
    const response = createPendingAssistantResponse('Clientes sin compra en 60 días');

    expect(response.queryLabel).toContain('Clientes sin compra en 60 días');
    expect(response.metadata.status).toBe('backend_pending');
    expect(response.answer).toContain('backend');
  });
});
