import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Calendar, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';

// Router-aware navigation component
const RouterAwareContent = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'client':
        return '/dashboard/client';
      case 'owner':
        return '/dashboard/owner';
      case 'controller':
        return '/dashboard/controller';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SC</span>
              </div>
              <span className="font-bold text-xl text-primary">SportsCourt</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/venues">
                  <Button variant="ghost">Canchas</Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    {user?.role === 'client' && (
                      <DropdownMenuItem onClick={() => navigate('/dashboard/client/reservations')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Mis Reservas</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/auth/register">
                  <Button>Registrarse</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Fallback navbar without router dependencies
const FallbackNavbar = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">SC</span>
              </div>
              <span className="font-bold text-xl text-primary">SportsCourt</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <a href="/auth/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </a>
                <a href="/auth/register">
                  <Button>Registrarse</Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Error boundary component
class RouterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's a router-related error
    if (error.message.includes('useNavigate') || error.message.includes('Router')) {
      return { hasError: true };
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      return <FallbackNavbar />;
    }

    return this.props.children;
  }
}

export const Navbar = () => {
  return (
    <RouterErrorBoundary>
      <RouterAwareContent />
    </RouterErrorBoundary>
  );
};