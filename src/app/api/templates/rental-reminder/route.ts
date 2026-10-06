import { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/auth.middleware";
import { RentalController } from "@/controllers/rental.controller";

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  return RentalController.sendReminderSms(req);
}
