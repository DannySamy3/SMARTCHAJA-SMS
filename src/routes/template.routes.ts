import { Router } from "express";
import { OtpController } from "../controllers/otp.controller";
import { RentalController } from "../controllers/rental.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/otp", authMiddleware, OtpController.sendOtp);
router.post("/rental-pickup", authMiddleware, RentalController.sendPickupSms);
router.post("/rental-reminder", authMiddleware, RentalController.sendReminderSms);
router.post("/rental-return", authMiddleware, RentalController.sendReturnSms);

export default router;
