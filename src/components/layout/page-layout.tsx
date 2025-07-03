
import { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { WhatsAppChat } from "@/components/whatsapp/whatsapp-chat";

interface PageLayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  showWhatsApp?: boolean;
}

export function PageLayout({ 
  children, 
  showNavbar = true, 
  showFooter = true,
  showWhatsApp = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <VisitorTracker />
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      {showWhatsApp && <WhatsAppChat />}
    </div>
  );
}
