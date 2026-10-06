import { ApiResponse } from "@/models/response.model";

export async function GET() {
  return ApiResponse.success({
    service: "smartchaja-sms-service",
    framework: "Next.js (App Router)",
    status: "healthy",
    version: "2.0.0",
    uptimeSeconds: process.uptime(),
  });
}
