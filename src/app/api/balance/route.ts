import { NextRequest } from "next/server";
import { validateApiKey } from "@/middleware/auth.middleware";
import { BalanceController } from "@/controllers/balance.controller";

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  return BalanceController.getBalance(req);
}
