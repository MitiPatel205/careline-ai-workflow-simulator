import { Router } from "express";
import {
  createIntake,
  listIntakes,
} from "../controllers/workflow.controller.js";

export const workflowRouter = Router();

workflowRouter.get("/", listIntakes);
workflowRouter.post("/intake", createIntake);