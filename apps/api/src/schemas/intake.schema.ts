import { z } from "zod";

export const intakeSchema = z.object({
  patientName: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().trim().min(7).max(25),
  concern: z.string().trim().min(10).max(1_000),
  urgency: z.enum(["routine", "soon", "urgent"]),
});

export type IntakeInput = z.infer<typeof intakeSchema>;

export const updateWorkflowStatusSchema = z.object({
  status: z.enum(["received", "triaged", "scheduled", "completed"]),
});

export type UpdateWorkflowStatusInput = z.infer<
  typeof updateWorkflowStatusSchema
>;