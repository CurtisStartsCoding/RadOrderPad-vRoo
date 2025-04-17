"use client";

import * as React from "react";
import { ToastProvider } from "../../../src/components/ui/use-toast";

/**
 * Root layout component
 * 
 * This component wraps all pages in the application.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
