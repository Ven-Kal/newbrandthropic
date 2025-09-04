
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, User, LogOut, Home, Briefcase, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch current badge
  useEffect(() => {
    if (!user) return;

    const fetchCurrentBadge = async () => {
      const { data: userData, error } = await supabase
        .from('users')
        .select(`
          current_badge_id,
          badges (
            id,
            name,
            icon_unlocked_url,
            icon_locked_url
          )
        `)
        .eq('user_id', user.user_id)
        .single();

      if (error) {
        console.error('Error fetching current badge:', error);
        return;
      }

      if (userData?.badges) {
        setCurrentBadge(userData.badges);
      }
    };

    fetchCurrentBadge();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center gap-1 sm:gap-2">
              <img 
                src="/logo-brand.png" 
                alt="Brandthropic Logo" 
                className="h-8 sm:h-10 w-auto object-contain"
                loading="eager"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('Logo failed to load from /logo-brand.png, trying fallback');
                  target.src = '/logo-favi.png';
                  target.onerror = () => {
                    console.log('Fallback logo also failed, showing text fallback');
                    target.style.display = 'none';
                    // Show text fallback if image fails
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.text-fallback')) {
                      const textFallback = document.createElement('span');
                      textFallback.className = 'text-lg sm:text-2xl font-bold text-primary text-fallback';
                      textFallback.textContent = 'Brandthropic';
                      parent.appendChild(textFallback);
                    }
                  };
                }}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link to="/brands" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
              <Briefcase className="h-4 w-4" />
              Brands
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About Us
            </Link>
            
            {isAuthenticated && user?.role === "consumer" && (
              <>
                <Link to="/my-reviews" className="text-sm font-medium hover:text-primary transition-colors">
                  My Reviews
                </Link>
                <Link to="/dashboard" className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors">
                  <Trophy className="h-4 w-4" />
                  Dashboard
                </Link>
              </>
            )}
            
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
                Admin Dashboard
              </Link>
            )}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Current Badge Display */}
                {currentBadge && (
                  <div className="flex items-center gap-2 px-2 py-1 bg-blue-50 rounded-full">
                    <img
                      src={currentBadge.icon_unlocked_url}
                      alt={currentBadge.name}
                      className="w-6 h-6 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = currentBadge.icon_locked_url;
                      }}
                    />
                    <span className="text-xs font-medium text-blue-800">
                      {currentBadge.name}
                    </span>
                  </div>
                )}
                
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
              </div>
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
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-2 sm:px-4 py-4 space-y-4">
            {/* Current Badge Display - Mobile */}
            {isAuthenticated && currentBadge && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <img
                  src={currentBadge.icon_unlocked_url}
                  alt={currentBadge.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = currentBadge.icon_locked_url;
                  }}
                />
                <span className="text-sm font-medium text-blue-800">
                  Current Badge: {currentBadge.name}
                </span>
              </div>
            )}
            
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
              <>
                <Link
                  to="/my-reviews"
                  className="block py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Reviews
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 py-2 text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Trophy className="h-5 w-5" />
                  Dashboard
                </Link>
              </>
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
