import { AdminCheck } from "../components/admin-check";
import { Header } from "../components/header";
import { Navigation } from "../components/navigation";
import "./style.css";
import { AdminProvider } from "@/contexts/admin-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminCheck>
        <div className="h-screen bg-gray-50 flex flex-col">
          <Header />
          <div className="flex h-full min-h-0">
            <Navigation />
            <main className="flex-1 p-6 h-full overflow-auto">{children}</main>
          </div>
        </div>
      </AdminCheck>
    </AdminProvider>
  );
}
