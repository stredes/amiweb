import {
  ADMIN_ASSISTANT_ENDPOINT,
  AdminAssistantQueryRequest,
  AdminAssistantQueryResponse,
} from './adminAssistantContract';

export async function queryAdminAssistant(
  _payload: AdminAssistantQueryRequest
): Promise<AdminAssistantQueryResponse> {
  throw new Error(
    `Admin assistant backend not connected. Expected endpoint: ${ADMIN_ASSISTANT_ENDPOINT}`
  );
}
