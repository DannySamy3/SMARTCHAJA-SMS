import { NextRequest } from "next/server";
import { ENV } from "@/config/env";
import { ApiResponse } from "@/models/response.model";

/**
 * Validates the API key from the request header against the configured secret.
 */
export function validateApiKey(req: NextRequest) {
  const configuredKey = ENV.API_SECRET_KEY;

  if (!configuredKey) {
    console.warn("⚠️ Warning: API_SECRET_KEY is not set. All incoming requests are permitted.");
    return null; // Allowed
  }

  const clientKey = req.headers.get("x-api-key") || req.nextUrl.searchParams.get("api_key");

  if (!clientKey || clientKey !== configuredKey) {
    return ApiResponse.unauthorized();
  }

  return null; // Authorized
}
