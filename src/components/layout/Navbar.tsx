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
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm sm:text-lg">R</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl bg-gradient-primary bg-clip-text text-transparent">
                ROGÜ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Company Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-3 py-2 transition-all duration-200">
                  Empresa
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl" align="start">
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
                  <Link to="/about" className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Info className="mr-3 h-4 w-4" />
                    <span>Quiénes Somos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
                  <Link to="/contact" className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Phone className="mr-3 h-4 w-4" />
                    <span>Contacto</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 mx-2" />
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
                  <Link to="/terms" className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <FileText className="mr-3 h-4 w-4" />
                    <span>Términos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
                  <Link to="/privacy" className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                    <Shield className="mr-3 h-4 w-4" />
                    <span>Privacidad</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                <Link to="/venues">
                  <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-3 py-2 transition-all duration-200">
                    Canchas
                  </Button>
                </Link>
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-auto px-3 py-2 rounded-xl flex items-center space-x-3 hover:bg-primary/10 transition-all duration-200">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-sm">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-foreground">{user?.name}</span>
                        <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl" align="end">
                    <DropdownMenuItem onClick={() => navigate(getDashboardRoute())} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                      {getRoleIcon()}
                      <span className="ml-3">Dashboard</span>
                    </DropdownMenuItem>
                    
                    {user?.role === 'client' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/client/reservations')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Calendar className="mr-3 h-4 w-4" />
                          <span>Mis Reservas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/venues')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Users className="mr-3 h-4 w-4" />
                          <span>Buscar Canchas</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {user?.role === 'owner' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/owner')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Building className="mr-3 h-4 w-4" />
                          <span>Mis Canchas</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/owner/reservations')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Calendar className="mr-3 h-4 w-4" />
                          <span>Reservas</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    {user?.role === 'controller' && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/controller')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <QrCode className="mr-3 h-4 w-4" />
                          <span>Scanner QR</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/dashboard/controller/access')} className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors">
                          <Users className="mr-3 h-4 w-4" />
                          <span>Control de Acceso</span>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="my-2 mx-2" />
                    <DropdownMenuItem className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-muted transition-colors">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Configuración</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg mx-1 my-1 px-3 py-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/login">
                  <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-4 py-2 transition-all duration-200">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-gradient-primary hover:opacity-90 text-white rounded-lg font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
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
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md absolute left-0 right-0 top-full z-50 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Company Links */}
              <div className="py-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Empresa
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/about"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Info className="mr-3 h-5 w-5" />
                    Quiénes Somos
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <Phone className="mr-3 h-5 w-5" />
                    Contacto
                  </Link>
                  <Link
                    to="/terms"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Términos
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
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
                  <div className="px-3 py-4 border-t border-border">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
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
                      className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Canchas
                    </Link>
                    
                    <Link
                      to={getDashboardRoute()}
                      className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      {getRoleIcon()}
                      <span className="ml-3">Dashboard</span>
                    </Link>

                    {user?.role === 'client' && (
                      <Link
                        to="/dashboard/client/reservations"
                        className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
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
                          className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                          onClick={closeMobileMenu}
                        >
                          <Building className="mr-3 h-5 w-5" />
                          Mis Canchas
                        </Link>
                        <Link
                          to="/dashboard/owner/reservations"
                          className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
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
                          className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                          onClick={closeMobileMenu}
                        >
                          <QrCode className="mr-3 h-5 w-5" />
                          Scanner QR
                        </Link>
                        <Link
                          to="/dashboard/controller/access"
                          className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                          onClick={closeMobileMenu}
                        >
                          <Users className="mr-3 h-5 w-5" />
                          Control de Acceso
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-border pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200"
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
                    className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200"
                    onClick={closeMobileMenu}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-3 py-3 text-base font-medium bg-gradient-primary text-white rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
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
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-sm sm:text-lg">R</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl bg-gradient-primary bg-clip-text text-transparent">
                ROGÜ
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-3">
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <a href="/auth/login">
                  <Button variant="ghost" className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-4 py-2 transition-all duration-200">
                    Iniciar Sesión
                  </Button>
                </a>
                <a href="/auth/register">
                  <Button className="bg-gradient-primary hover:opacity-90 text-white rounded-lg font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
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