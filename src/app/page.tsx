export default function HomePage() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/templates/otp",
      desc: "Sends OTP verification code",
      body: '{\n  "phoneNumber": "255712345678",\n  "otpCode": "123456"\n}',
    },
    {
      method: "POST",
      path: "/api/templates/rental-pickup",
      desc: "Sends rental pickup confirmation",
      body: '{\n  "phoneNumber": "255712345678",\n  "userName": "Customer",\n  "deviceId": "CN-8821"\n}',
    },
    {
      method: "POST",
      path: "/api/templates/rental-reminder",
      desc: "Sends 15-min rental reminder",
      body: '{\n  "phoneNumber": "255712345678",\n  "reminderMinutes": 15\n}',
    },
    {
      method: "POST",
      path: "/api/templates/rental-return",
      desc: "Sends return & thank you SMS",
      body: '{\n  "phoneNumber": "255712345678",\n  "userName": "Customer"\n}',
    },
    {
      method: "POST",
      path: "/api/sms/send",
      desc: "Sends any custom SMS message",
      body: '{\n  "phoneNumber": "255712345678",\n  "message": "Custom message text"\n}',
    },
    {
      method: "POST",
      path: "/api/sms/bulk",
      desc: "Sends message to multiple recipients",
      body: '{\n  "recipients": ["255712345678", "255787654321"],\n  "message": "Announcement"\n}',
    },
    {
      method: "GET",
      path: "/api/balance",
      desc: "Fetches live Beem Africa SMS balance",
      body: null,
    },
    {
      method: "GET",
      path: "/api/health",
      desc: "Health check & uptime monitor",
      body: null,
    },
  ];

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #1e293b", paddingBottom: "24px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0", color: "#38bdf8" }}>
              ⚡ SmartChaja SMS & OTP Gateway
            </h1>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
              Next.js MVC Standalone Microservice • Powered by Beem Africa
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span
              style={{
                backgroundColor: "#064e3b",
                color: "#34d399",
                padding: "6px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              API ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Architecture Highlights */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "36px" }}>
        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#f1f5f9" }}>🛡️ WAF & Bot Bypass</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            Engineered with static keepAlive HTTPS agent, schedule_time payload enforcement, and 2-phase retry loops to prevent 403 blocks.
          </p>
        </div>

        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#f1f5f9" }}>🏗️ MVC Architecture</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            Models (Zod validation) • Controllers (Route handlers) • Services (Beem API client & centralized SMS templates).
          </p>
        </div>

        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#f1f5f9" }}>🐳 Docker Standalone</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: "1.5" }}>
            Multi-stage Alpine container ready for one-command deployment on your Hostinger VPS via Docker Compose.
          </p>
        </div>
      </section>

      {/* Endpoints Documentation */}
      <section>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#e2e8f0" }}>
          📡 Available Endpoints (Protected by <code style={{ color: "#38bdf8" }}>x-api-key</code>)
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "10px",
                padding: "16px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      backgroundColor: ep.method === "POST" ? "#0369a1" : "#15803d",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "700",
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {ep.method}
                  </span>
                  <code style={{ fontSize: "14px", fontWeight: "600", color: "#f8fafc" }}>{ep.path}</code>
                </div>
                <span style={{ fontSize: "13px", color: "#94a3b8" }}>{ep.desc}</span>
              </div>

              {ep.body && (
                <div style={{ marginTop: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "600", marginBottom: "4px" }}>
                    Sample JSON Body
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      backgroundColor: "#020617",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: "1px solid #1e293b",
                      fontSize: "12px",
                      color: "#38bdf8",
                      overflowX: "auto",
                    }}
                  >
                    {ep.body}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Firebase Integration Snippet */}
      <section style={{ marginTop: "36px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", color: "#e2e8f0" }}>
          🔗 Calling from Firebase Cloud Functions
        </h2>
        <div style={{ backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "10px", padding: "18px" }}>
          <pre style={{ margin: 0, fontSize: "13px", color: "#e2e8f0", overflowX: "auto", lineHeight: "1.6" }}>
{`// Inside functions/src/functions/verifyOTPAndGetToken.js
const axios = require("axios");

const response = await axios.post(
  "https://sms.your-hostinger-domain.com/api/templates/otp",
  {
    phoneNumber: cleanPhone,
    otpCode: otpCode,
  },
  {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.SMS_SERVICE_API_KEY || "your_api_secret_key_here",
    },
    timeout: 10000,
  }
);`}
          </pre>
        </div>
      </section>
    </main>
  );
}
