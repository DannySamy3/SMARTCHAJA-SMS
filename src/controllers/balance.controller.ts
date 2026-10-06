import { NextRequest } from "next/server";
import { ApiResponse } from "@/models/response.model";
import { BeemService } from "@/services/beem.service";

export class BalanceController {
  static async getBalance(_req: NextRequest) {
    try {
      const balanceData = await BeemService.getBalance();
      return ApiResponse.success(balanceData, "Beem Africa balance fetched successfully");
    } catch (error: any) {
      console.error("[BalanceController] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to retrieve balance from Beem Africa");
    }
  }
}
