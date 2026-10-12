import { randomUUID } from "node:crypto";
import type { IntakeInput } from "../schemas/intake.schema.js";
import type { CareRequest } from "../types/workflow.types.js";
import type { WorkflowStatus } from "../types/workflow.types.js";

const careRequests: CareRequest[] = [];

export function createCareRequest(input: IntakeInput): CareRequest {
  const now = new Date().toISOString();

  const request: CareRequest = {
    id: randomUUID(),
    ...input,
    status: "received",
    createdAt: now,
    updatedAt: now,
  };

  careRequests.push(request);

  return request;
}

export function getCareRequests(): CareRequest[] {
  return careRequests;
}
export function updateCareRequestStatus(
  id: string,
  status: WorkflowStatus,
): CareRequest | undefined {
  const careRequest = careRequests.find((request) => request.id === id);

  if (!careRequest) {
    return undefined;
  }

  careRequest.status = status;
  careRequest.updatedAt = new Date().toISOString();

  return careRequest;
}