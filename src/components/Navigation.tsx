
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProtectedRoute = (path: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              FinTrace
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => handleProtectedRoute('/analysis')}
              className="text-foreground hover:text-pink-500 transition-colors"
            >
              Analysis
            </button>
            <button
              onClick={() => handleProtectedRoute('/history')}
              className="text-foreground hover:text-pink-500 transition-colors"
            >
              History
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.user_metadata?.full_name || user.email} />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-blue-500 text-white">
                        {(user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-foreground hover:text-pink-500"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
