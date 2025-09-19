import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password, formData.role);
      toast({
        title: "¡Bienvenido!",
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-sports">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">SC</span>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Iniciar Sesión</CardTitle>
          <CardDescription className="text-muted-foreground">
            Accede a tu cuenta de SportsCourt
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Tipo de Usuario</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="owner">Propietario</SelectItem>
                  <SelectItem value="controller">Controlador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link to="/auth/register" className="text-primary hover:underline font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
          
          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Credenciales de prueba:</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>Cliente:</strong> cliente@demo.com</p>
              <p><strong>Propietario:</strong> owner@demo.com</p>
              <p><strong>Controlador:</strong> controller@demo.com</p>
              <p><strong>Contraseña:</strong> cualquier cosa</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;