import type { Metadata } from "next";
import "./globals.css";
import { globalErrorHandler } from "../lib/notifications";

export const metadata: Metadata = {
  title: "GST Registration Portal",
  description: "Liberian Government GST Registration Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize global error handler
  if (typeof window !== 'undefined') {
    globalErrorHandler.initialize();
  }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
