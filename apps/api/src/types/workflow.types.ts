export const workflowStatuses = [
  "received",
  "triaged",
  "scheduled",
  "completed",
] as const;

export type WorkflowStatus = (typeof workflowStatuses)[number];

export interface CareRequest {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  concern: string;
  urgency: "routine" | "soon" | "urgent";
  status: WorkflowStatus;
  createdAt: string;
  updatedAt: string;
}