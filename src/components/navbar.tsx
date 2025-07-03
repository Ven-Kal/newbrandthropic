
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, User, LogOut, Home, Briefcase } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/logo-brand.png" 
                alt="Brandthropic Logo" 
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-brandblue-800">
                Brandthropic
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/brands" className="text-sm font-medium flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Brands
            </Link>
            <Link to="/about" className="text-sm font-medium">
              About Us
            </Link>
            
            {isAuthenticated && user?.role === "consumer" && (
              <Link to="/my-reviews" className="text-sm font-medium">
                My Reviews
              </Link>
            )}
            
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium">
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout} className="gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            
            <Link
              to="/brands"
              className="flex items-center gap-2 py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              Brands
            </Link>
            
            <Link
              to="/about"
              className="block py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            
            {isAuthenticated && user?.role === "consumer" && (
              <Link
                to="/my-reviews"
                className="block py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Reviews
              </Link>
            )}
            
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="block py-2 text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout ({user?.name?.split(' ')[0] || 'User'})
              </Button>
            ) : (
              <Button
                asChild
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
