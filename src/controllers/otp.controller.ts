import { NextRequest } from "next/server";
import { SendOtpSchema } from "@/models/sms.model";
import { ApiResponse } from "@/models/response.model";
import { TemplateService } from "@/services/template.service";
import { BeemService } from "@/services/beem.service";

export class OtpController {
  static async sendOtp(req: NextRequest) {
    try {
      const body = await req.json().catch(() => ({}));
      const parseResult = SendOtpSchema.safeParse(body);

      if (!parseResult.success) {
        return ApiResponse.badRequest("Validation failed", parseResult.error.flatten());
      }

      const { phoneNumber, otpCode, customMessage } = parseResult.data;
      const message = customMessage || TemplateService.getOtpMessage(otpCode);

      const result = await BeemService.sendSingleSms(phoneNumber, message);

      return ApiResponse.success(
        {
          recipient: result.recipient,
          requestId: result.requestId,
        },
        "OTP SMS dispatched successfully"
      );
    } catch (error: any) {
      console.error("[OtpController] Error:", error.message);
      return ApiResponse.gatewayError(error.message || "Failed to send OTP SMS");
    }
  }
}
