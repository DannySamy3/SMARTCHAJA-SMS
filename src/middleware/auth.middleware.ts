import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env";
import { ApiResponse } from "../models/response.model";

/**
 * Express middleware to validate the x-api-key header (or query param).
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const configuredKey = ENV.API_SECRET_KEY;

  if (!configuredKey) {
    console.warn("⚠️ Warning: API_SECRET_KEY is not set. All incoming requests are permitted.");
    return next();
  }

  const clientKey = req.headers["x-api-key"] || req.query.api_key;

  if (!clientKey || clientKey !== configuredKey) {
    return ApiResponse.unauthorized(res);
  }

  next();
}
