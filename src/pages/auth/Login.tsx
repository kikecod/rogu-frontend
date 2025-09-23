import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

/* =========================================================
   LoginPlus – más UX, accesibilidad y consistencia con el tema
   - Validación ligera (email + requeridos)
   - Mensajes de error por campo
   - Mostrar/ocultar contraseña accesible (aria-pressed)
   - "Recordarme" (persistencia en localStorage del email y rol)
   - Chips para autocompletar credenciales demo
   - Tokens de color (bg-card, border-border, muted-foreground) → Dark/Light OK
   - Responsivo y con focus rings visibles
   ========================================================= */

const EMAIL_RE = /^(?:[a-zA-Z0-9_'^&+{}=~!-]+(?:\.[a-zA-Z0-9_'^&+{}=~!-]+)*|"(?:[^"\\]|\\.)+")@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z-]*[a-zA-Z]:.+)\])$/;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Prefill desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem('login:remember');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { email?: string; remember?: boolean };
        setFormData((p) => ({ ...p, email: parsed.email || '' }));
        setRemember(Boolean(parsed.remember ?? true));
      } catch {}
    }
  }, []);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.email) e.email = 'Ingresa tu correo';
    else if (!EMAIL_RE.test(formData.email)) e.email = 'Correo inválido';
    if (!formData.password) e.password = 'Ingresa tu contraseña';
    else if (formData.password.length < 4) e.password = 'Mínimo 4 caracteres';
    return e;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;

    setIsLoading(true);
    try {
      // El login ahora maneja la respuesta del backend directamente
      await login(formData.email, formData.password);
      toast({ title: '¡Bienvenido de vuelta! 👋', description: 'Has iniciado sesión correctamente' });

      // Persistencia opcional
      if (remember) {
        localStorage.setItem(
          'login:remember',
          JSON.stringify({ email: formData.email, remember })
        );
      } else {
        localStorage.removeItem('login:remember');
      }

      // Redirigir al dashboard principal (se determinará el rol desde el backend)
      navigate('/dashboard/client'); // Por defecto, o se puede cambiar según el rol del usuario
    } catch (error) {
      toast({
        title: 'Error de autenticación',
        description: 'Credenciales inválidas. Verifica tu correo y contraseña.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/*Decoración sutil respetando tema*/}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative w-full max-w-md">
        <Card className="bg-card/95 border border-border shadow-card-custom supports-[backdrop-filter]:backdrop-blur-xl">
          <CardHeader className="text-center pb-6 sm:pb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl grid place-items-center mx-auto mb-5 sm:mb-6 shadow-glow">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-1 sm:mb-2">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm sm:text-base">
              Accede a tu cuenta de ROGÜ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Correo Electrónico
                </Label>
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
                {touched.email && !!errors.email && (
                  <p id="email-err" className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
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
                {touched.password && !!errors.password && (
                  <p id="password-err" className="text-xs text-destructive">{errors.password}</p>
                )}

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-border text-primary focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    Recordarme en este dispositivo
                  </label>
                  <Link to="/auth/forgot" className="text-xs sm:text-sm text-primary hover:opacity-90">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 bg-gradient-primary hover:opacity-90 rounded-xl font-semibold text-base sm:text-lg shadow-glow hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:saturate-75 disabled:cursor-not-allowed"
                disabled={isLoading || !isValid}
                aria-disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión…
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] sm:text-xs uppercase">
                <span className="bg-card px-3 sm:px-4 text-muted-foreground font-medium">
                  ¿No tienes cuenta?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 text-primary hover:opacity-90 font-semibold"
              >
                Crear cuenta gratuita
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;