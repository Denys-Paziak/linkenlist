import type React from "react";
import { UserProvider } from "@/contexts/user-context";
import ScrollToTop from "@/components/scroll-to-top";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { SWRProvider } from "../../contexts/swr-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRProvider role="user">
      <UserProvider>
        <Header />
        <ScrollToTop />
        {children}
        <Footer />
      </UserProvider>
    </SWRProvider>
  );
}
