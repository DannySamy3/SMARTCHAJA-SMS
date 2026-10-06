import dotenv from "dotenv";
dotenv.config();

/**
 * Environment configuration.
 * Real secrets are loaded from environment variables or .env file.
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "7677",
  API_SECRET_KEY: process.env.API_SECRET_KEY || "",
  BEEM_API_KEY: process.env.BEEM_API_KEY || "",
  BEEM_SECRET_KEY: process.env.BEEM_SECRET_KEY || "",
  BEEM_SENDER_ID: process.env.BEEM_SENDER_ID || "SmartChaja",
  BEEM_API_URL: "https://apisms.beem.africa/v1/send",
  BEEM_BALANCE_URL: "https://apisms.beem.africa/public/v1/vendors/balance",
};
