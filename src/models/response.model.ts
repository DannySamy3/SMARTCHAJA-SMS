import { NextResponse } from "next/server";

export interface ApiResponseData<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(data?: T, message = "Operation successful", status = 200) {
    const body: ApiResponseData<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(body, { status });
  }

  static error(error = "An error occurred", status = 500, details?: unknown) {
    const body: ApiResponseData = {
      success: false,
      error,
      details,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(body, { status });
  }

  static unauthorized(error = "Unauthorized: Invalid or missing x-api-key header") {
    return this.error(error, 401);
  }

  static badRequest(error = "Invalid request payload", details?: unknown) {
    return this.error(error, 400, details);
  }

  static gatewayError(error = "SMS Gateway Error", details?: unknown) {
    return this.error(error, 502, details);
  }
}
