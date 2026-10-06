import { NextRequest } from "next/server";
import { SendCustomSmsSchema, SendBulkSmsSchema } from "@/models/sms.model";
import { ApiResponse } from "@/models/response.model";
import { BeemService } from "@/services/beem.service";

export class SmsController {
  /**
   * Send a generic custom SMS
   */
  static async sendCustomSms(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendCustomSmsSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, message, senderId } = parseResult.data;
      const result = await BeemService.sendSingleSms(phoneNumber, message, senderId);

      return ApiResponse.success(
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        result.message
      );
    } catch (error: any) {
      console.error("[SmsController.sendCustomSms] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send custom SMS");
    }
  }

  /**
   * Send bulk SMS to multiple recipients
   */
  static async sendBulkSms(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendBulkSmsSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { recipients, message, senderId } = parseResult.data;
      const result = await BeemService.sendBulkSms(recipients, message, senderId);

      return ApiResponse.success(
        {
          validCount: result.valid,
          totalCount: result.total,
        },
        result.message
      );
    } catch (error: any) {
      console.error("[SmsController.sendBulkSms] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send bulk SMS");
    }
  }
}
