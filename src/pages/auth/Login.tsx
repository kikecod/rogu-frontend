import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import type { UserRole } from '../../types';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '' as UserRole | '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos para continuar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password, formData.role);
      toast({
        title: "¡Bienvenido de vuelta! 👋",
        description: "Has iniciado sesión correctamente",
      });
      
      // Redirect based on role
      const dashboardRoutes = {
        client: '/dashboard/client',
        owner: '/dashboard/owner',
        controller: '/dashboard/controller',
      };
      
      navigate(dashboardRoutes[formData.role]);
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: "Credenciales inválidas. Intenta con estos datos de prueba: cliente@demo.com, owner@demo.com, controller@demo.com",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative w-full max-w-md animate-scale-in">
        <Card className="glass border-0 shadow-xl backdrop-blur-xl">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-foreground mb-2">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Accede a tu cuenta de ROGÜ
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground">
                  Tipo de Usuario
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <SelectValue placeholder="Selecciona tu rol" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200">
                    <SelectItem value="client" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cliente - Quiero reservar canchas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="owner" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Propietario - Tengo canchas</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="controller" className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Controlador - Verifico accesos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-12 pl-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="h-12 pl-12 pr-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">¿No tienes cuenta?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                to="/auth/register" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-200"
              >
                Crear cuenta gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Demo credentials */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h4 className="font-semibold text-sm mb-3 text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                Credenciales de prueba
              </h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Cliente:</span>
                  <span className="font-mono">cliente@demo.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Propietario:</span>
                  <span className="font-mono">owner@demo.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Controlador:</span>
                  <span className="font-mono">controller@demo.com</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200">
                  <span className="font-medium">Contraseña:</span>
                  <span className="font-mono">cualquier cosa</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;