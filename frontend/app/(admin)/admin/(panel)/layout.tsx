import type React from "react";
import "./style.css"
import { AdminProvider } from "@/contexts/admin-context";
import { Navigation } from "../../../../components/admin/navigation";
import { SWRProvider } from "../../../../contexts/swr-context";
import { Header } from "../../../../components/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRProvider>
      <AdminProvider>
        <div className="h-screen bg-gray-50 flex flex-col">
          {/* Header */}
          <Header />

          <div className="flex h-full min-h-0">
            {/* Left Navigation */}
            <Navigation />
            {/* Main Content */}
            <main className="flex-1 p-6 h-full overflow-auto">{children}</main>
          </div>
        </div>
      </AdminProvider>
    </SWRProvider>
  );
}
