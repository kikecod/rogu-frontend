import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
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
  Users,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";

/* =========================================================
   NAVBAR MEJORADO – Enfoque en UX, accesibilidad y mantenimiento
   - Estados de activo con NavLink
   - Modo oscuro/claro con persistencia
   - Sombras dinámicas al hacer scroll
   - Menú móvil con cierre por ESC y al navegar
   - Menú de usuario por rol (reutilizable)
   - "Skip to content" y mejores ARIA labels
   ========================================================= */

// --- Utilidades UI ---
const cx = (...cls: Array<string | false | null | undefined>) =>
  cls.filter(Boolean).join(" ");

const NavLogo = ({ onClick }: { onClick?: () => void }) => (
  <Link
    to="/"
    className="flex items-center space-x-2 group outline-none"
    onClick={onClick}
    aria-label="Ir al inicio"
  >
    {/* Caja del logo: oscuro en modo claro, gradiente marca en modo oscuro */}
    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-tr from-gray-900 to-gray-700 dark:from-[hsl(var(--primary-dark))] dark:to-[hsl(var(--primary))]">
      {/* Letra siempre blanca para máximo contraste */}
      <span className="text-white font-bold text-sm sm:text-lg">R</span>
    </div>
    {/* Marca: texto sólido en claro para legibilidad; gradiente sólo en oscuro */}
    <span className="font-bold text-xl sm:text-2xl text-foreground dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-[hsl(var(--primary))] dark:to-[hsl(var(--accent))]">
      ROGÜ
    </span>
  </Link>
);

// --- Theme Toggle ---
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };
}

// --- Icono/label según rol ---
const roleIcon = (role?: string) => {
  switch (role) {
    case "owner":
      return <Building className="w-4 h-4" />;
    case "controller":
      return <QrCode className="w-4 h-4" />;
    case "client":
      return <User className="w-4 h-4" />;
    default:
      return <User className="w-4 h-4" />;
  }
};

const roleLabel = (role?: string) => {
  switch (role) {
    case "owner":
      return "Propietario";
    case "controller":
      return "Controlador";
    case "client":
      return "Cliente";
    default:
      return "Usuario";
  }
};

// --- Rutas por rol ---
const roleDashboard = (role?: string) => {
  switch (role) {
    case "client":
      return "/dashboard/client";
    case "owner":
      return "/dashboard/owner";
    case "controller":
      return "/dashboard/controller";
    default:
      return "/";
  }
};

// --- Links de menú Empresa (reusables) ---
const CompanyLinks = ({ onClick }: { onClick?: () => void }) => (
  <>
    <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
      <Link
        to="/about"
        className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        onClick={onClick}
      >
        <Info className="mr-3 h-4 w-4" />
        <span>Quiénes Somos</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
      <Link
        to="/contact"
        className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        onClick={onClick}
      >
        <Phone className="mr-3 h-4 w-4" />
        <span>Contacto</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator className="my-2 mx-2" />
    <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
      <Link
        to="/terms"
        className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        onClick={onClick}
      >
        <FileText className="mr-3 h-4 w-4" />
        <span>Términos</span>
      </Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild className="rounded-lg mx-1 my-1">
      <Link
        to="/privacy"
        className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        onClick={onClick}
      >
        <Shield className="mr-3 h-4 w-4" />
        <span>Privacidad</span>
      </Link>
    </DropdownMenuItem>
  </>
);

// --- Bloques por rol (desktop + mobile reuso) ---
function ClientLinks({ onClick }: { onClick?: () => void }) {
  const items = [
    {
      to: "/dashboard/client/reservations",
      icon: Calendar,
      label: "Mis Reservas",
    },
    { to: "/venues", icon: Users, label: "Buscar Canchas" },
  ];
  return (
    <>
      {items.map(({ to, icon: Icon, label }) => (
        <DropdownMenuItem
          key={to}
          onClick={onClick}
          asChild
          className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link to={to} className="flex items-center">
            <Icon className="mr-3 h-4 w-4" />
            <span>{label}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}

function OwnerLinks({ onClick }: { onClick?: () => void }) {
  const items = [
    { to: "/dashboard/owner", icon: Building, label: "Mis Canchas" },
    { to: "/dashboard/owner/reservations", icon: Calendar, label: "Reservas" },
  ];
  return (
    <>
      {items.map(({ to, icon: Icon, label }) => (
        <DropdownMenuItem
          key={to}
          onClick={onClick}
          asChild
          className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link to={to} className="flex items-center">
            <Icon className="mr-3 h-4 w-4" />
            <span>{label}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}

function ControllerLinks({ onClick }: { onClick?: () => void }) {
  const items = [
    { to: "/dashboard/controller", icon: QrCode, label: "Scanner QR" },
    {
      to: "/dashboard/controller/access",
      icon: Users,
      label: "Control de Acceso",
    },
  ];
  return (
    <>
      {items.map(({ to, icon: Icon, label }) => (
        <DropdownMenuItem
          key={to}
          onClick={onClick}
          asChild
          className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Link to={to} className="flex items-center">
            <Icon className="mr-3 h-4 w-4" />
            <span>{label}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}

// --- Contenido sensible al Router ---
const RouterAwareContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  // Cerrar menú móvil al navegar
  useEffect(() => {
    if (isMobileOpen) setIsMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Cerrar por ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sombra dinámica al hacer scroll
  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardRoute = useMemo(() => roleDashboard(user?.role), [user?.role]);

  return (
    <nav
      className={cx(
        "bg-background/60 backdrop-blur-md border-b border-border sticky top-0 z-50 transition-shadow duration-300",
        elevated && "shadow-sm"
      )}
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] bg-primary text-primary-foreground px-3 py-2 rounded-md"
      >
        Saltar al contenido
      </a>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <NavLogo />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Menú Empresa */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-3 py-2 transition-all"
                  aria-label="Abrir menú Empresa"
                >
                  Empresa
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl"
                align="start"
              >
                <CompanyLinks />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Link Canchas visible para todos (autenticados lo usan mucho) */}
            <NavLink
              to="/venues"
              className={({ isActive }) =>
                cx(
                  "rounded-lg px-3 py-2 font-medium transition-colors",
                  "hover:text-primary hover:bg-primary/10",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              Canchas
            </NavLink>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              aria-label={
                theme === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
              className="rounded-lg px-2"
              onClick={toggle}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Usuario */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-auto px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-primary/10 transition-all"
                    aria-label="Abrir menú de usuario"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold text-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground line-clamp-1 max-w-[12ch]">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {roleLabel(user?.role)}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-background/95 backdrop-blur-md border border-border shadow-xl rounded-xl"
                  align="end"
                >
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-primary/10 hover:text-primary"
                  >
                    <Link to={dashboardRoute} className="flex items-center">
                      {roleIcon(user?.role)}
                      <span className="ml-3">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {user?.role === "client" && <ClientLinks />}
                  {user?.role === "owner" && <OwnerLinks />}
                  {user?.role === "controller" && <ControllerLinks />}

                  <DropdownMenuSeparator className="my-2 mx-2" />
                  <DropdownMenuItem className="rounded-lg mx-1 my-1 px-3 py-2 hover:bg-muted">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg mx-1 my-1 px-3 py-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login">
                  <Button
                    variant="ghost"
                    className="font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg px-4 py-2"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-gradient-primary hover:opacity-90 text-white rounded-lg font-semibold px-4 py-2 shadow-lg hover:shadow-xl hover:scale-105">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón móvil */}
          <div className="lg:hidden flex items-center gap-1">
            <Button
              variant="ghost"
              aria-label={
                theme === "dark"
                  ? "Cambiar a modo claro"
                  : "Cambiar a modo oscuro"
              }
              className="rounded-lg p-2"
              onClick={toggle}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen((v) => !v)}
              className="p-2 text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              aria-label={
                isMobileOpen ? "Cerrar menú móvil" : "Abrir menú móvil"
              }
            >
              {isMobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileOpen && (
          <div
            id="mobile-menu"
            ref={mobileRef}
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md absolute left-0 right-0 top-full z-50 shadow-lg will-change-transform animate-in fade-in slide-in-from-top-2"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Empresa */}
              <div className="py-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Empresa
                </h3>
                <div className="space-y-1">
                  <Link
                    to="/about"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                  >
                    <Info className="mr-3 h-5 w-5" />
                    Quiénes Somos
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                  >
                    <Phone className="mr-3 h-5 w-5" />
                    Contacto
                  </Link>
                  <Link
                    to="/terms"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Términos
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Privacidad
                  </Link>
                </div>
              </div>

              {/* Autenticado */}
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-medium text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {roleLabel(user?.role)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <NavLink
                      to="/venues"
                      className={({ isActive }) =>
                        cx(
                          "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                          "hover:text-primary hover:bg-primary/10",
                          isActive ? "text-primary" : "text-foreground"
                        )
                      }
                    >
                      <Users className="mr-3 h-5 w-5" />
                      Canchas
                    </NavLink>

                    <NavLink
                      to={dashboardRoute}
                      className={({ isActive }) =>
                        cx(
                          "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                          "hover:text-primary hover:bg-primary/10",
                          isActive ? "text-primary" : "text-foreground"
                        )
                      }
                    >
                      {roleIcon(user?.role)}
                      <span className="ml-3">Dashboard</span>
                    </NavLink>

                    {user?.role === "client" && (
                      <NavLink
                        to="/dashboard/client/reservations"
                        className={({ isActive }) =>
                          cx(
                            "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                            "hover:text-primary hover:bg-primary/10",
                            isActive ? "text-primary" : "text-foreground"
                          )
                        }
                      >
                        <Calendar className="mr-3 h-5 w-5" />
                        Mis Reservas
                      </NavLink>
                    )}

                    {user?.role === "owner" && (
                      <>
                        <NavLink
                          to="/dashboard/owner"
                          className={({ isActive }) =>
                            cx(
                              "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                              "hover:text-primary hover:bg-primary/10",
                              isActive ? "text-primary" : "text-foreground"
                            )
                          }
                        >
                          <Building className="mr-3 h-5 w-5" />
                          Mis Canchas
                        </NavLink>
                        <NavLink
                          to="/dashboard/owner/reservations"
                          className={({ isActive }) =>
                            cx(
                              "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                              "hover:text-primary hover:bg-primary/10",
                              isActive ? "text-primary" : "text-foreground"
                            )
                          }
                        >
                          <Calendar className="mr-3 h-5 w-5" />
                          Reservas
                        </NavLink>
                      </>
                    )}

                    {user?.role === "controller" && (
                      <>
                        <NavLink
                          to="/dashboard/controller"
                          className={({ isActive }) =>
                            cx(
                              "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                              "hover:text-primary hover:bg-primary/10",
                              isActive ? "text-primary" : "text-foreground"
                            )
                          }
                        >
                          <QrCode className="mr-3 h-5 w-5" />
                          Scanner QR
                        </NavLink>
                        <NavLink
                          to="/dashboard/controller/access"
                          className={({ isActive }) =>
                            cx(
                              "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors",
                              "hover:text-primary hover:bg-primary/10",
                              isActive ? "text-primary" : "text-foreground"
                            )
                          }
                        >
                          <Users className="mr-3 h-5 w-5" />
                          Control de Acceso
                        </NavLink>
                      </>
                    )}
                  </div>

                  <div className="border-t border-border pt-2 mt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-3 text-base font-medium text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
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
                    className="block px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block px-3 py-3 text-base font-medium bg-gradient-primary text-white rounded-lg text-center shadow-lg hover:shadow-xl hover:scale-105"
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

// --- Fallback si hay error del Router ---
class RouterErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    if (
      error.message.includes("useNavigate") ||
      error.message.includes("Router")
    ) {
      return { hasError: true };
    }
    return null;
  }
  render() {
    if (this.state.hasError) {
      return (
        <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex justify-between h-14 sm:h-16">
              <div className="flex items-center">
                <a href="/" className="flex items-center space-x-2 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span className="font-bold text-sm sm:text-lg">R</span>
                  </div>
                  <span className="font-bold text-xl sm:text-2xl bg-gradient-primary bg-clip-text text-transparent">
                    ROGÜ
                  </span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      );
    }
    return this.props.children;
  }
}

export const Navbar: React.FC = () => (
  <RouterErrorBoundary>
    <RouterAwareContent />
  </RouterErrorBoundary>
);
