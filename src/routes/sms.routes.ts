import { Router } from "express";
import { SmsController } from "../controllers/sms.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/send", authMiddleware, SmsController.sendCustomSms);
router.post("/bulk", authMiddleware, SmsController.sendBulkSms);

export default router;
