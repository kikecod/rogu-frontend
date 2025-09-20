import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/authStore';
import { 
  LogOut, 
  User, 
  Calendar, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  Info,
  Phone,
  FileText,
  Shield,
  Building,
  QrCode,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';

// Router-aware navigation component
const RouterAwareContent = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
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

  const getRoleIcon = () => {
    if (!user) return <User className="w-4 h-4" />;
    switch (user.role) {
      case 'client':
        return <User className="w-4 h-4" />;
      case 'owner':
        return <Building className="w-4 h-4" />;
      case 'controller':
        return <QrCode className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = () => {
    if (!user) return 'Usuario';
    switch (user.role) {
      case 'client':
        return 'Cliente';
      case 'owner':
        return 'Propietario';
      case 'controller':
        return 'Controlador';
      default:
        return 'Usuario';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-display font-bold text-lg">R</span>
              </div>
              <span className="font-display font-bold text-2xl text-primary">ROGÜ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Company Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium hover:bg-primary/10 rounded-lg">
                  Empresa
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="start">
                <DropdownMenuItem asChild>
                  <Link to="/about" className="flex items-center">
                    <Info className="mr-2 h-4 w-4" />
                    <span>Quiénes Somos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/contact" className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Contacto</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/terms" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Términos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/privacy" className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Privacidad</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                <Link to="/venues">
                  <Button variant="ghost" className="font-medium hover:bg-primary/10 rounded-lg">
                    Canchas
                  </Button>
                </Link>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-xl flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-foreground">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem onClick={() => navigate(getDashboardRoute())}>
                      {getRoleIcon()}
                      <span className="ml-2">Dashboard</span>
                    </DropdownMenuItem>
                    
                    {user?.role === 'client' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/client/reservations')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Mis Reservas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/venues')}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Buscar Canchas</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {user?.role === 'owner' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/owner')}>
                          <Building className="mr-2 h-4 w-4" />
                          <span>Mis Canchas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/owner/reservations')}>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Reservas</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {user?.role === 'controller' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/controller')}>
                          <QrCode className="mr-2 h-4 w-4" />
                          <span>Scanner QR</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/controller/access')}>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Control de Acceso</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" className="font-medium hover:bg-primary/10 rounded-lg">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-gradient-primary hover:opacity-90 rounded-lg font-semibold shadow-glow">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Company Links */}
              <div className="py-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Empresa
                </h3>
                <div className="mt-1 space-y-1">
                  <Link
                    to="/about"
                    className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Info className="mr-3 h-5 w-5" />
                    Quiénes Somos
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Phone className="mr-3 h-5 w-5" />
                    Contacto
                  </Link>
                  <Link
                    to="/terms"
                    className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Términos
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Privacidad
                  </Link>
                </div>
              </div>

              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-3 py-3 border-t border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{getRoleLabel()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <Link
                      to="/venues"
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                      onClick={closeMobileMenu}
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Canchas
                    </Link>
                    
                    <Link
                      to={getDashboardRoute()}
                      className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                      onClick={closeMobileMenu}
                    >
                      {getRoleIcon()}
                      <span className="ml-3">Dashboard</span>
                    </Link>

                    {user?.role === 'client' && (
                      <Link
                        to="/dashboard/client/reservations"
                        className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                        onClick={closeMobileMenu}
                      >
                        <Calendar className="mr-3 h-5 w-5" />
                        Mis Reservas
                      </Link>
                    )}

                    {user?.role === 'owner' && (
                      <>
                        <Link
                          to="/dashboard/owner"
                          className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                          onClick={closeMobileMenu}
                        >
                          <Building className="mr-3 h-5 w-5" />
                          Mis Canchas
                        </Link>
                        <Link
                          to="/dashboard/owner/reservations"
                          className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                          onClick={closeMobileMenu}
                        >
                          <Calendar className="mr-3 h-5 w-5" />
                          Reservas
                        </Link>
                      </>
                    )}

                    {user?.role === 'controller' && (
                      <>
                        <Link
                          to="/dashboard/controller"
                          className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                          onClick={closeMobileMenu}
                        >
                          <QrCode className="mr-3 h-5 w-5" />
                          Scanner QR
                        </Link>
                        <Link
                          to="/dashboard/controller/access"
                          className="flex items-center px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                          onClick={closeMobileMenu}
                        >
                          <Users className="mr-3 h-5 w-5" />
                          Control de Acceso
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-2 pt-2 border-t border-border">
                  <Link
                    to="/auth/login"
                    className="block px-3 py-2 text-base font-medium text-foreground hover:bg-primary/10 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-3 py-2 text-base font-medium bg-gradient-primary text-primary-foreground rounded-lg text-center"
                    onClick={closeMobileMenu}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Fallback navbar without router dependencies
const FallbackNavbar = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-display font-bold text-lg">R</span>
              </div>
              <span className="font-display font-bold text-2xl text-primary">ROGÜ</span>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <a href="/auth/login">
                  <Button variant="ghost" className="font-medium hover:bg-primary/10 rounded-lg">
                    Iniciar Sesión
                  </Button>
                </a>
                <a href="/auth/register">
                  <Button className="bg-gradient-primary hover:opacity-90 rounded-lg font-semibold shadow-glow">
                    Registrarse
                  </Button>
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