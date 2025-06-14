
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  Building,
  MessageSquare,
  Settings,
  Users,
  FileText
} from "lucide-react";

type AdminRoute = "dashboard" | "brands" | "blogs" | "reviews" | "users" | "settings";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  active: AdminRoute;
}

export function AdminLayout({ children, title, active }: AdminLayoutProps) {
  const location = useLocation();
  
  // Navigation links
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      id: "dashboard" as AdminRoute
    },
    {
      name: "Brands",
      href: "/admin/brands",
      icon: <Building className="h-5 w-5" />,
      id: "brands" as AdminRoute
    },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: <FileText className="h-5 w-5" />,
      id: "blogs" as AdminRoute
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: <MessageSquare className="h-5 w-5" />,
      id: "reviews" as AdminRoute
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      id: "users" as AdminRoute
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      id: "settings" as AdminRoute
    }
  ];
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-white">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/admin" className="text-xl font-bold text-brandblue-800">
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active === item.id
                  ? "bg-brandblue-50 text-brandblue-800"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          <h1 className="text-xl font-bold">{title}</h1>
          
          {/* Mobile nav toggle would go here */}
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
