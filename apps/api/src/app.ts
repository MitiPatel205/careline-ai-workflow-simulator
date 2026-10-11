import cors from "cors";
import express from "express";
import { healthRouter } from "./routes/health.routes.js";
import { workflowRouter } from "./routes/workflow.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_request, response) => {
  response.status(200).json({
    message: "Welcome to the CareLine AI API",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/workflows", workflowRouter);

app.use((_request, response) => {
  response.status(404).json({
    error: "Route not found",
  });
});