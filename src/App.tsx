import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { useAuthStore } from "./store/authStore";
import Index from "./pages/index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VenueList from "./pages/venues/VenueList";
import ClientDashboard from "./pages/dashboard/ClientDashboard";
import ClientReservations from "./pages/dashboard/ClientReservations";
import VenueDetail from "./pages/venues/VenueDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="venues" element={<VenueList />} />
          </Route>
          
          {/* Auth Routes - No Layout */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Protected Routes with Layout */}
          <Route path="/dashboard" element={<Layout />}>
            <Route path="client" element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="client/reservations" element={
              <ProtectedRoute requiredRole="client">
                <ClientReservations />
              </ProtectedRoute>
            } />
            <Route path="owner" element={
              <ProtectedRoute requiredRole="owner">
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Dashboard de Propietario</h1>
                  <p className="text-muted-foreground">Próximamente: Gestión de canchas y reservas</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="controller" element={
              <ProtectedRoute requiredRole="controller">
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Dashboard de Controlador</h1>
                  <p className="text-muted-foreground">Próximamente: Scanner QR y validación de accesos</p>
                </div>
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Venue Detail Route */}
          <Route path="/venue/:id" element={<Layout />}>
            <Route index element={<VenueDetail />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;