import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinkEnlist.com - Military Resources Directory",
  description:
    "Find direct links to your military websites faster. Your trusted directory for official military and Department of Defense resources.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
