import { Router } from "express";
import healthRoutes from "./health.routes";
import balanceRoutes from "./balance.routes";
import smsRoutes from "./sms.routes";
import templateRoutes from "./template.routes";

const router = Router();

// Health check endpoints
router.use("/health", healthRoutes);
router.use("/api/health", healthRoutes);

// Core SMS and balance endpoints
router.use("/api/balance", balanceRoutes);
router.use("/api/sms", smsRoutes);
router.use("/api/templates", templateRoutes);

export default router;
