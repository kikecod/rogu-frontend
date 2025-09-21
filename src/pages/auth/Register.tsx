import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import type { UserRole } from '../../types';

/* =========================================================
   RegisterPlus – UX, accesibilidad y consistencia de tema
   - Validación completa con mensajes por campo
   - Medidor de seguridad de contraseña (longitud + variedad)
   - Mostrar/ocultar contraseñas accesible
   - Checkbox Términos para habilitar envío
   - Tokens de color (bg-card, border-border, muted-foreground) → dark/light OK
   - Responsivo y focus rings visibles
   ========================================================= */

type Strength = { score: number; label: string; color: string };

function getPasswordStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: '', color: 'bg-transparent' };
  let s = 0;
  if (pw.length >= 6) s += 1;
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1; // símbolos
  const map: Record<number, Strength> = {
    0: { score: 0, label: 'Muy débil', color: 'bg-red-500' },
    1: { score: 20, label: 'Débil', color: 'bg-red-500' },
    2: { score: 40, label: 'Regular', color: 'bg-yellow-500' },
    3: { score: 60, label: 'Buena', color: 'bg-blue-500' },
    4: { score: 80, label: 'Muy buena', color: 'bg-green-500' },
    5: { score: 100, label: 'Excelente', color: 'bg-green-600' },
  };
  return map[s as 0 | 1 | 2 | 3 | 4 | 5];
}

const Register: React.FC = () => {
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
  const [acceptTerms, setAcceptTerms] = useState(true); // puedes iniciar en false si lo prefieres
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Ingresa tu nombre';
    if (!formData.role) e.role = 'Selecciona tu tipo de usuario';
    if (!formData.email.trim()) e.email = 'Ingresa tu correo';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Correo inválido';
    if (!formData.password) e.password = 'Ingresa una contraseña';
    else if (formData.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (!formData.confirmPassword) e.confirmPassword = 'Confirma la contraseña';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!acceptTerms) e.terms = 'Debes aceptar los términos para continuar';
    return e;
  }, [formData, acceptTerms]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true, role: true });
    if (!isValid) return;

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.role as UserRole);
      toast({ title: '¡Cuenta creada exitosamente! 🎉', description: 'Bienvenido a ROGÜ, tu plataforma de reservas deportivas' });
      const dashboardRoutes: Record<UserRole, string> = {
        client: '/dashboard/client',
        owner: '/dashboard/owner',
        controller: '/dashboard/controller',
      } as const;
      navigate(dashboardRoutes[formData.role as UserRole]);
    } catch (error) {
      toast({ title: 'Error al crear la cuenta', description: 'No se pudo crear la cuenta. Intenta nuevamente.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <Card className="bg-card/95 border border-border shadow-card-custom supports-[backdrop-filter]:backdrop-blur-xl">
          <CardHeader className="text-center pb-6 sm:pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl grid place-items-center mx-auto mb-5 sm:mb-6 shadow-glow">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1 sm:mb-2">Crear Cuenta</CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">Únete a ROGÜ y reserva tu cancha ideal</CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    className="h-11 sm:h-12 pl-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    required
                    aria-invalid={touched.name && !!errors.name}
                    aria-describedby={touched.name && errors.name ? 'name-err' : undefined}
                  />
                </div>
                {touched.name && errors.name && <p id="name-err" className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Rol */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-foreground">Tipo de Usuario</Label>
                <Select value={formData.role} onValueChange={(value) => handleChange('role', value)}>
                  <SelectTrigger id="role" className="h-11 sm:h-12 rounded-xl border-border bg-background">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <SelectValue placeholder="¿Cómo planeas usar ROGÜ?" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="client" className="rounded-lg">Cliente — Reservar canchas</SelectItem>
                    <SelectItem value="owner" className="rounded-lg">Propietario — Alquilar mis canchas</SelectItem>
                    <SelectItem value="controller" className="rounded-lg">Controlador — Verificar accesos</SelectItem>
                  </SelectContent>
                </Select>
                {touched.role && errors.role && <p className="text-xs text-destructive">{errors.role}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    className="h-11 sm:h-12 pl-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    required
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={touched.email && errors.email ? 'email-err' : undefined}
                  />
                </div>
                {touched.email && errors.email && <p id="email-err" className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className="h-11 sm:h-12 pl-12 pr-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    required
                    aria-invalid={touched.password && !!errors.password}
                    aria-describedby={touched.password && errors.password ? 'password-err' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && <p id="password-err" className="text-xs text-destructive">{errors.password}</p>}

                {/* Strength meter */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] sm:text-xs">
                      <span className="text-muted-foreground">Seguridad de la contraseña</span>
                      <span className={`font-medium ${strength.score >= 75 ? 'text-green-600' : strength.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                    className="h-11 sm:h-12 pl-12 pr-12 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    required
                    aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
                    aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'confirm-err' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-pressed={showConfirmPassword}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && <p id="confirm-err" className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-border text-primary focus-visible:ring-1 focus-visible:ring-primary"
                />
                <span>
                  Acepto los <Link to="/terms" className="text-primary hover:opacity-90 underline underline-offset-2">Términos y Condiciones</Link> y la
                  <Link to="/privacy" className="text-primary hover:opacity-90 underline underline-offset-2"> Política de Privacidad</Link>.
                </span>
              </label>
              {touched.confirmPassword && errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-primary hover:opacity-90 rounded-xl font-semibold text-base sm:text-lg shadow-glow hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:saturate-75 disabled:cursor-not-allowed"
                disabled={isLoading || !isValid}
                aria-disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta…
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Crear Cuenta
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-[11px] sm:text-xs uppercase">
                <span className="bg-card px-3 sm:px-4 text-muted-foreground font-medium">¿Ya tienes cuenta?</span>
              </div>
            </div>

            <div className="text-center">
              <Link to="/auth/login" className="inline-flex items-center gap-2 text-primary hover:opacity-90 font-semibold">
                Iniciar sesión
                <ShieldCheck className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;