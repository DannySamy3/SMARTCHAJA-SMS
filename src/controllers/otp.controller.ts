import { Request, Response } from "express";
import { SendOtpSchema } from "../models/sms.model";
import { ApiResponse } from "../models/response.model";
import { TemplateService } from "../services/template.service";
import { BeemService } from "../services/beem.service";

export class OtpController {
  static async sendOtp(req: Request, res: Response) {
    try {
      const parseResult = SendOtpSchema.safeParse(req.body);

      if (!parseResult.success) {
        return ApiResponse.badRequest(res, "Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, otpCode, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getOtpMessage(otpCode);

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        res,
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "OTP SMS dispatched successfully"
      );
    } catch (error: any) {
      console.error("[OtpController] Error:", error.message);
      return ApiResponse.gatewayError(res, error.message || "Failed to send OTP SMS");
    }
  }
}
