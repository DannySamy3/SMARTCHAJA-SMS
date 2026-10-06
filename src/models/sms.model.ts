import { z } from "zod";

/**
 * Phone number validation & normalization regex/logic helper
 */
export const PhoneSchema = z
  .string()
  .min(9, "Phone number is too short")
  .max(16, "Phone number is too long")
  .transform((val) => {
    let cleaned = val.replace(/\s+/g, "").replace(/^\+/, "");
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }
    if (!cleaned.startsWith("255")) {
      cleaned = "255" + cleaned;
    }
    return cleaned;
  });

/**
 * 1. OTP Verification SMS Schema
 */
export const SendOtpSchema = z.object({
  phoneNumber: PhoneSchema,
  otpCode: z.string().min(4, "OTP code must have at least 4 digits"),
  customMessage: z.string().optional(),
});
export type SendOtpInput = z.infer<typeof SendOtpSchema>;

/**
 * 2. Rental Pickup SMS Schema (When user unlocks a power bank)
 */
export const SendRentalPickupSchema = z.object({
  phoneNumber: PhoneSchema,
  userName: z.string().optional().default("User"),
  deviceId: z.string().optional(),
  tradeNo: z.string().optional(),
  customMessage: z.string().optional(),
});
export type SendRentalPickupInput = z.infer<typeof SendRentalPickupSchema>;

/**
 * 3. Rental Reminder SMS Schema (When rental time is almost over)
 */
export const SendRentalReminderSchema = z.object({
  phoneNumber: PhoneSchema,
  userName: z.string().optional().default("User"),
  reminderMinutes: z.number().optional().default(15),
  customMessage: z.string().optional(),
});
export type SendRentalReminderInput = z.infer<typeof SendRentalReminderSchema>;

/**
 * 4. Rental Return SMS Schema (When power bank is returned to station)
 */
export const SendRentalReturnSchema = z.object({
  phoneNumber: PhoneSchema,
  userName: z.string().optional().default("User"),
  deviceId: z.string().optional(),
  tradeNo: z.string().optional(),
  customMessage: z.string().optional(),
});
export type SendRentalReturnInput = z.infer<typeof SendRentalReturnSchema>;

/**
 * 5. Generic Custom SMS Schema
 */
export const SendCustomSmsSchema = z.object({
  phoneNumber: PhoneSchema,
  message: z.string().min(1, "Message content cannot be empty"),
  senderId: z.string().optional(),
});
export type SendCustomSmsInput = z.infer<typeof SendCustomSmsSchema>;

/**
 * 6. Bulk SMS Schema
 */
export const SendBulkSmsSchema = z.object({
  recipients: z.array(PhoneSchema).min(1, "At least one recipient is required"),
  message: z.string().min(1, "Message content cannot be empty"),
  senderId: z.string().optional(),
});
export type SendBulkSmsInput = z.infer<typeof SendBulkSmsSchema>;

/**
 * Beem Africa Internal Request / Response types
 */
export interface BeemRecipient {
  recipient_id: number;
  dest_addr: string;
}

export interface BeemSmsPayload {
  source_addr: string;
  schedule_time: string;
  encoding: number;
  message: string;
  recipients: BeemRecipient[];
}

export interface BeemSmsResponse {
  successful: boolean;
  request_id?: number;
  code?: number;
  message?: string;
  valid?: number;
  invalid?: number;
  duplicates?: number;
}
