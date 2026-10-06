import { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/auth.middleware";
import { SmsController } from "@/controllers/sms.controller";

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  return SmsController.sendCustomSms(req);
}
