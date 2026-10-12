import { Router } from "express";
import {
  createIntake,
  listIntakes,
  updateIntakeStatus,
} from "../controllers/workflow.controller.js";

export const workflowRouter = Router();

workflowRouter.get("/", listIntakes);
workflowRouter.post("/intake", createIntake);
workflowRouter.patch("/:id/status", updateIntakeStatus);