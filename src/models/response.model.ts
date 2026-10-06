import { Response } from "express";

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(res: Response, data?: T, message = "Operation successful", status = 200) {
    const body: ApiResponseData<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(status).json(body);
  }

  static error(res: Response, error = "An error occurred", status = 500, details?: unknown) {
    const body: ApiResponseData = {
      success: false,
      error,
      details,
      timestamp: new Date().toISOString(),
    };
    return res.status(status).json(body);
  }

  static unauthorized(res: Response, error = "Unauthorized: Invalid or missing x-api-key header") {
    return this.error(res, error, 401);
  }

  static badRequest(res: Response, error = "Invalid request payload", details?: unknown) {
    return this.error(res, error, 400, details);
  }

  static gatewayError(res: Response, error = "SMS Gateway Error", details?: unknown) {
    return this.error(res, error, 502, details);
  }
}
