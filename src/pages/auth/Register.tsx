import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import type { UserRole } from '../../types';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as UserRole | '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos para continuar",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Asegúrate de que ambas contraseñas sean idénticas",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      toast({
        title: "¡Cuenta creada exitosamente! 🎉",
        description: "Bienvenido a ROGÜ, tu plataforma de reservas deportivas",
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
        title: "Error al crear la cuenta",
        description: "No se pudo crear la cuenta. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 4) return { strength: 25, label: 'Débil', color: 'bg-red-500' };
    if (password.length < 6) return { strength: 50, label: 'Regular', color: 'bg-yellow-500' };
    if (password.length < 8) return { strength: 75, label: 'Buena', color: 'bg-blue-500' };
    return { strength: 100, label: 'Excelente', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
              <UserPlus className="w-10 h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-display font-bold text-foreground mb-2">
              Crear Cuenta
            </CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Únete a ROGÜ y reserva tu cancha ideal
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-12 pl-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-200"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground">
                  Tipo de Usuario
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <SelectValue placeholder="¿Cómo planeas usar ROGÜ?" />
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
                        <span>Propietario - Tengo canchas para alquilar</span>
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
                    placeholder="Mínimo 6 caracteres"
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
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Seguridad de la contraseña</span>
                      <span className={`font-medium ${passwordStrength.strength >= 75 ? 'text-green-600' : passwordStrength.strength >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="h-12 pl-12 pr-12 rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:opacity-90 rounded-xl font-semibold text-lg shadow-glow hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Crear Cuenta
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
                <span className="bg-white px-4 text-gray-500 font-medium">¿Ya tienes cuenta?</span>
              </div>
            </div>
            
            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors duration-200"
              >
                Iniciar sesión
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;