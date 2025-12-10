import type React from "react";
import "./style.css";
import { UserProvider } from "@/contexts/user-context";
import ScrollToTop from "@/components/scroll-to-top";
import { UserCheck } from "../../components/user-check";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { LoginModal } from "../../components/login-modal";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <UserCheck>
        <>
          <Header />
          <ScrollToTop />
          {children}
          <Footer />
          <LoginModal />
        </>
      </UserCheck>
    </UserProvider>
  );
}
