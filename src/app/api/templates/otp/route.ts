import { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/auth.middleware";
import { OtpController } from "@/controllers/otp.controller";

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  return OtpController.sendOtp(req);
}
