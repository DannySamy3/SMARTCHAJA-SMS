import { Router } from "express";
import { BalanceController } from "../controllers/balance.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authMiddleware, BalanceController.getBalance);

export default router;
