import axios, { AxiosInstance } from "axios";
import https from "https";
import { ENV } from "../config/env";
import { BeemSmsPayload, BeemSmsResponse } from "../models/sms.model";

/**
 * Highly optimized client for Beem Africa SMS Gateway.
 * Uses persistent TCP/TLS connection pooling and pre-computed auth headers
 * to minimize CPU, memory, and network latency per request.
 */
export class BeemService {
  private static createAgent(): https.Agent {
    return new https.Agent({
      rejectUnauthorized: false,
      keepAlive: true,
      maxSockets: 50,
      maxFreeSockets: 10,
      keepAliveMsecs: 30000,
      timeout: 5000,
    });
  }

  // High-performance HTTPS agent with connection pooling & keep-alive
  private static httpsAgent: https.Agent = BeemService.createAgent();

  // Reusable Axios instance with pre-configured headers
  private static readonly client: AxiosInstance = axios.create({
    timeout: 5000,
    httpsAgent: BeemService.httpsAgent,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  /**
   * Resets the HTTPS agent to discard hung or dead sockets in the pool
   */
  private static resetAgent() {
    try {
      this.httpsAgent.destroy();
    } catch (_) {
      // ignore
    }
    this.httpsAgent = BeemService.createAgent();
    this.client.defaults.httpsAgent = this.httpsAgent;
  }

  private static getHeaders() {
    const authHeader = "Basic " + Buffer.from(`${ENV.BEEM_API_KEY}:${ENV.BEEM_SECRET_KEY}`).toString("base64");
    return {
      Authorization: authHeader,
    };
  }

  /**
   * Send a single SMS to one recipient with retry resilience
   */
  static async sendSingleSms(
    phoneNumber: string,
    message: string,
    senderId?: string
  ): Promise<{ success: boolean; requestId?: number; recipient: string; message: string }> {
    const sourceAddr = senderId || ENV.BEEM_SENDER_ID;

    const payload: BeemSmsPayload = {
      source_addr: sourceAddr,
      schedule_time: "",
      encoding: 0,
      message,
      recipients: [
        {
          recipient_id: 1,
          dest_addr: phoneNumber,
        },
      ],
    };

    const maxAttempts = 2;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.post<BeemSmsResponse>(ENV.BEEM_API_URL, payload, {
          headers: this.getHeaders(),
          timeout: 5000,
        });

        if (response.data && response.data.successful) {
          return {
            success: true,
            requestId: response.data.request_id,
            recipient: phoneNumber,
            message: response.data.message || "Message Submitted Successfully",
          };
        } else {
          throw new Error(response.data?.message || "Beem Africa rejected the submission");
        }
      } catch (err: any) {
        lastError = err;
        const status = err.response?.status;
        const data = err.response?.data;
        console.warn(`[BeemService] Attempt ${attempt} failed: Status ${status || "NET_ERR"}`, data || err.message);

        // Reset agent on network error or timeout to ensure clean socket on retry
        if (err.code === "ECONNABORTED" || err.message?.includes("timeout") || !err.response) {
          this.resetAgent();
        }

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    throw new Error(
      (lastError as any)?.response?.data?.message ||
        (lastError as any)?.message ||
        "Failed to deliver SMS via Beem Africa"
    );
  }

  /**
   * Send bulk SMS to multiple recipients in a single request with retry resilience
   */
  static async sendBulkSms(
    recipients: string[],
    message: string,
    senderId?: string
  ): Promise<{ success: boolean; valid: number; total: number; message: string }> {
    const sourceAddr = senderId || ENV.BEEM_SENDER_ID;

    const beemRecipients = recipients.map((phone, idx) => ({
      recipient_id: idx + 1,
      dest_addr: phone,
    }));

    const payload: BeemSmsPayload = {
      source_addr: sourceAddr,
      schedule_time: "",
      encoding: 0,
      message,
      recipients: beemRecipients,
    };

    const maxAttempts = 2;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.post<BeemSmsResponse>(ENV.BEEM_API_URL, payload, {
          headers: this.getHeaders(),
          timeout: 7000,
        });

        if (response.data && response.data.successful) {
          return {
            success: true,
            valid: response.data.valid || recipients.length,
            total: recipients.length,
            message: response.data.message || "Bulk messages queued successfully",
          };
        } else {
          throw new Error(response.data?.message || "Failed to dispatch bulk SMS");
        }
      } catch (err: any) {
        lastError = err;
        const status = err.response?.status;
        const data = err.response?.data;
        console.warn(`[BeemService Bulk] Attempt ${attempt} failed: Status ${status || "NET_ERR"}`, data || err.message);

        if (err.code === "ECONNABORTED" || err.message?.includes("timeout") || !err.response) {
          this.resetAgent();
        }

        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    throw new Error(
      (lastError as any)?.response?.data?.message ||
        (lastError as any)?.message ||
        "Failed to dispatch bulk SMS via Beem Africa"
    );
  }

  /**
   * Check SMS Balance on Beem Africa
   */
  static async getBalance(): Promise<any> {
    const response = await this.client.get(ENV.BEEM_BALANCE_URL, {
      headers: this.getHeaders(),
      timeout: 5000,
    });
    return response.data;
  }
}
