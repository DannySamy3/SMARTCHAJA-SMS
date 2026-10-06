import { Request, Response } from "express";
import { ApiResponse } from "../models/response.model";
import { BeemService } from "../services/beem.service";

export class BalanceController {
  static async getBalance(_req: Request, res: Response) {
    try {
      const balanceData = await BeemService.getBalance();
      return ApiResponse.success(res, balanceData, "Beem Africa balance fetched successfully");
    } catch (error: any) {
      console.error("[BalanceController] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to retrieve balance from Beem Africa");
    }
  }
}
