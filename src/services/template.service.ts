/**
 * Service to manage all SmartChaja SMS templates in one central place.
 */
export class TemplateService {
  /**
   * 1. OTP Verification SMS Template
   */
  static getOtpMessage(otpCode: string): string {
    return `Your Smart Chaja verification code is: ${otpCode}. Valid for 10 minutes.`;
  }

  /**
   * 2. Rental Pickup SMS Template (Power bank unlocked)
   */
  static getRentalPickupMessage(): string {
    return (
      "Thank you for using SmartChaja. Enjoy charging. " +
      "Please return the power bank to any SmartChaja station before your rental time ends."
    );
  }

  /**
   * 3. Rental Reminder SMS Template (15 mins before rental ends)
   */
  static getRentalReminderMessage(): string {
    return (
      "SmartChaja Reminder: Your rental time is almost over. " +
      "Please return the power bank to any SmartChaja station to avoid extra charges."
    );
  }

  /**
   * 4. Rental Return SMS Template (Power bank locked back in station)
   */
  static getRentalReturnMessage(): string {
    return (
      "Power bank returned successfully. Thank you for choosing SmartChaja. " +
      "We appreciate you and look forward to serving you again."
    );
  }
}
