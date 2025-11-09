import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkEnlist.com - Military Resources Directory",
  description:
    "Find direct links to your military websites faster. Your trusted directory for official military and Department of Defense resources.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.includes?.("MetaMask") ||
        args[0]?.includes?.("ChromeTransport")
      ) {
        return; // Suppress MetaMask errors
      }
      originalError.apply(console, args);
    };
  }

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </body>
    </html>
  );
}
