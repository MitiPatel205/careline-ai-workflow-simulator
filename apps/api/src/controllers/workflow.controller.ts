import type { Request, Response } from "express";
import { intakeSchema } from "../schemas/intake.schema.js";
import {
  createCareRequest,
  getCareRequests,
} from "../services/workflow.service.js";

export function createIntake(request: Request, response: Response): void {
  const result = intakeSchema.safeParse(request.body);

  if (!result.success) {
    response.status(400).json({
      error: "Invalid intake request",
      details: result.error.issues,
    });
    return;
  }

  const careRequest = createCareRequest(result.data);

  response.status(201).json({
    message: "Care request received",
    data: careRequest,
  });
}

export function listIntakes(_request: Request, response: Response): void {
  response.status(200).json({
    data: getCareRequests(),
  });
}