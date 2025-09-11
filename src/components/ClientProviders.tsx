"use client";

import { SessionProvider } from "next-auth/react";
import { AppProvider } from "../contexts/AppContext";
import ThemeProvider from "./ThemeProvider";
import { ToastProvider } from "./ui/toaster";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <AppProvider>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </AppProvider>
    </SessionProvider>
  );
}

