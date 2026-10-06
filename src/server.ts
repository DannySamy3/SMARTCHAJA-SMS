import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ENV } from "./config/env";
import routes from "./routes";
import { ApiResponse } from "./models/response.model";

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Minimal request logger
app.use((req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  _res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${_res.statusCode} - ${duration}ms`);
  });
  next();
});

// Root endpoint: Pure JSON API information
app.get("/", (_req: Request, res: Response) => {
  return ApiResponse.success(res, {
    service: "SmartChaja SMS Gateway",
    type: "REST API Microservice",
    version: "2.0.0",
    docs: {
      health: "GET /api/health",
      balance: "GET /api/balance",
      sendSms: "POST /api/sms/send",
      bulkSms: "POST /api/sms/bulk",
      templates: {
        otp: "POST /api/templates/otp",
        rentalPickup: "POST /api/templates/rental-pickup",
        rentalReminder: "POST /api/templates/rental-reminder",
        rentalReturn: "POST /api/templates/rental-return",
      },
    },
  });
});

// Mount application routes
app.use(routes);

// 404 Not Found handler
app.use((_req: Request, res: Response) => {
  return ApiResponse.error(res, "Endpoint not found", 404);
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ServerError]:", err);
  return ApiResponse.error(res, err.message || "Internal server error", 500);
});

const PORT = parseInt(ENV.PORT, 10) || 7677;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SmartChaja SMS Microservice running on http://0.0.0.0:${PORT}`);
  console.log(`🔒 Authentication: x-api-key header required`);
});

export default app;
