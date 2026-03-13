import {
  ADMIN_ASSISTANT_ENDPOINT,
  AdminAssistantChatRequest,
  AdminAssistantChatResponse,
  normalizeAdminAssistantResponse,
} from './adminAssistantContract';
import { httpRequest } from '../../lib/httpClient';

export async function queryAdminAssistant(
  payload: AdminAssistantChatRequest
): Promise<AdminAssistantChatResponse> {
  const response = await httpRequest<AdminAssistantChatResponse>(ADMIN_ASSISTANT_ENDPOINT, {
    method: 'POST',
    body: payload,
  });

  return normalizeAdminAssistantResponse(response);
}
