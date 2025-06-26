import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface PageLayoutProps {
  showNavbar?: boolean;
  showFooter?: boolean;
}

export function PageLayout({ 
  showNavbar = true, 
  showFooter = true 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
