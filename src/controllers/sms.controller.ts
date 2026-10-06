import { Request, Response } from "express";
import { SendCustomSmsSchema, SendBulkSmsSchema } from "../models/sms.model";
import { ApiResponse } from "../models/response.model";
import { BeemService } from "../services/beem.service";

export class SmsController {
  /**
   * Send a generic custom SMS
   */
  static async sendCustomSms(req: Request, res: Response) {
    try {
      const parseResult = SendCustomSmsSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, message, senderId } = parseResult.data;
      const result = await BeemService.sendSingleSms(phoneNumber, message, senderId);

      return ApiResponse.success(
        res,
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        result.message
      );
    } catch (error: any) {
      console.error("[SmsController.sendCustomSms] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send custom SMS");
    }
  }

  /**
   * Send bulk SMS to multiple recipients
   */
  static async sendBulkSms(req: Request, res: Response) {
    try {
      const parseResult = SendBulkSmsSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { recipients, message, senderId } = parseResult.data;
      const result = await BeemService.sendBulkSms(recipients, message, senderId);

      return ApiResponse.success(
        res,
        {
          validCount: result.valid,
          totalCount: result.total,
        },
        result.message
      );
    } catch (error: any) {
      console.error("[SmsController.sendBulkSms] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send bulk SMS");
    }
  }
}
