import { Request, Response } from "express";
import {
  SendRentalPickupSchema,
  SendRentalReminderSchema,
  SendRentalReturnSchema,
} from "../models/sms.model";
import { ApiResponse } from "../models/response.model";
import { TemplateService } from "../services/template.service";
import { BeemService } from "../services/beem.service";

export class RentalController {
  /**
   * 1. Send SMS when a user rents/unlocks a power bank
   */
  static async sendPickupSms(req: Request, res: Response) {
    try {
      const parseResult = SendRentalPickupSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalPickupMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        res,
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental pickup SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendPickupSms] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send rental pickup SMS");
    }
  }

  /**
   * 2. Send SMS reminder before rental period ends
   */
  static async sendReminderSms(req: Request, res: Response) {
    try {
      const parseResult = SendRentalReminderSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalReminderMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        res,
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental reminder SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendReminderSms] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send rental reminder SMS");
    }
  }

  /**
   * 3. Send SMS when a power bank is returned to station
   */
  static async sendReturnSms(req: Request, res: Response) {
    try {
      const parseResult = SendRentalReturnSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getRentalReturnMessage();

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        res,
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "Rental return SMS sent successfully"
      );
    } catch (error: any) {
      console.error("[RentalController.sendReturnSms] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send rental return SMS");
    }
  }
}
