import { NextRequest } from "next/server";
import {
  SendRentalPickupSchema,
  SendRentalReminderSchema,
  SendRentalReturnSchema,
} from "@/models/sms.model";
import { ApiResponse } from "@/models/response.model";
import { TemplateService } from "@/services/template.service";
import { BeemService } from "@/services/beem.service";

export class RentalController {
  /**
   * 1. Send SMS when a user rents/unlocks a power bank
   */
  static async sendPickupSms(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendRentalPickupSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalPickupMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental pickup SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendPickupSms] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send rental pickup SMS");
    }
  }

  /**
   * 2. Send SMS reminder before rental period ends
   */
  static async sendReminderSms(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendRentalReminderSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalReminderMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental reminder SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendReminderSms] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send rental reminder SMS");
    }
  }

  /**
   * 3. Send SMS when a power bank is returned to station
   */
  static async sendReturnSms(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendRentalReturnSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalReturnMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental return SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendReturnSms] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send rental return SMS");
    }
  }
}
