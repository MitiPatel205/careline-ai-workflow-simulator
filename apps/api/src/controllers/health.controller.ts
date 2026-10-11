import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response): void {
  response.status(200).json({
    status: "healthy",
    service: "careline-api",
    timestamp: new Date().toISOString(),
  });
}