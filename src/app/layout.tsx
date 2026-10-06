import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartChaja SMS & OTP Dispatch Service",
  description: "Enterprise SMS Gateway & OTP Microservice for SmartChaja via Beem Africa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
