import { Router, Request, Response } from "express";
import { ApiResponse } from "../models/response.model";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    service: "smartchaja-sms-service",
    runtime: "Node.js (Express)",
    status: "healthy",
    version: "2.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;
