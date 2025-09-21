import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle, Copy } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

/* =========================================================
   ContactPlus – Versión completa y responsiva
   - Prefill ?subject= / ?asunto=
   - Validación (email, requeridos, límite) + errores por campo
   - Estado de envío y botón deshabilitado estilizado
   - Honeypot anti-spam
   - Copiar email/teléfono, links mailto/tel
   - Estilos tokens (bg-card, border-border, etc.) + responsive
   ========================================================= */

const EMAIL_RE = /^(?:[a-zA-Z0-9_'^&+{}=~!-]+(?:\.[a-zA-Z0-9_'^&+{}=~!-]+)*|"(?:[^"\\]|\\.)+")@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z-]*[a-zA-Z]:.+)\])$/;
const MAX_MESSAGE = 1200;

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [sp] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '', // honeypot
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // Prefill subject desde URL
  useEffect(() => {
    const s = sp.get('subject') ?? sp.get('asunto');
    if (s) setFormData((p) => ({ ...p, subject: s.slice(0, 80) }));
  }, [sp]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Ingresa tu nombre';
    if (!formData.email.trim()) e.email = 'Ingresa tu email';
    else if (!EMAIL_RE.test(formData.email)) e.email = 'Formato de email inválido';
    if (!formData.subject.trim()) e.subject = 'Ingresa un asunto';
    if (!formData.message.trim()) e.message = 'Escribe tu mensaje';
    else if (formData.message.length > MAX_MESSAGE) e.message = `Máximo ${MAX_MESSAGE} caracteres`;
    if (formData.company.trim().length > 0) e.company = 'spam'; // honeypot
    return e;
  }, [formData]);

  const isValid = useMemo(() => {
    const keys = Object.keys(errors);
    return keys.length === 0 || (keys.length === 1 && !!errors.company);
  }, [errors]);

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleBlur = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;
    if (formData.company.trim().length > 0) {
      toast({ title: 'Error', description: 'No pudimos enviar el mensaje.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      // Simulación de request
      await new Promise((r) => setTimeout(r, 900));
      toast({ title: 'Mensaje enviado', description: 'Gracias por contactarnos. Te responderemos pronto.' });
      setFormData({ name: '', email: '', subject: '', message: '', company: '' });
      setTouched({});
    } catch (err) {
      toast({ title: 'Error al enviar', description: 'Intenta nuevamente en unos segundos.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copiado', description: `${label} copiado al portapapeles.` });
    } catch (_) {
      toast({ title: 'No se pudo copiar', description: 'Copia manualmente por favor.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="ghost" className="px-2 sm:px-3">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Volver al inicio</span>
              <span className="sm:hidden">Inicio</span>
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-foreground mb-3 sm:mb-6">Contáctanos</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o sugerencia? Estamos aquí para ayudarte. Contáctanos y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Form */}
          <Card className="bg-card border border-border shadow-card-custom">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Envíanos un mensaje</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                {/* Honeypot */}
                <input
                  type="text"
                  name="company"
                  autoComplete="organization"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  aria-hidden
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nombre *</label>
                    <Input
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      required
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? 'name-err' : undefined}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    />
                    {touched.name && errors.name && (
                      <p id="name-err" className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email *</label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      required
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={touched.email && errors.email ? 'email-err' : undefined}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                    />
                    {touched.email && errors.email && (
                      <p id="email-err" className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Asunto *</label>
                  <Input
                    placeholder="¿En qué podemos ayudarte?"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    onBlur={() => handleBlur('subject')}
                    required
                    aria-invalid={touched.subject && !!errors.subject}
                    aria-describedby={touched.subject && errors.subject ? 'subject-err' : undefined}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                  />
                  {touched.subject && errors.subject && (
                    <p id="subject-err" className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Mensaje *</label>
                    <span className="text-xs text-muted-foreground">{formData.message.length}/{MAX_MESSAGE}</span>
                  </div>
                  <Textarea
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    required
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={touched.message && errors.message ? 'message-err' : undefined}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent"
                  />
                  {touched.message && errors.message && (
                    <p id="message-err" className="text-xs text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 disabled:opacity-60 disabled:saturate-75 disabled:cursor-not-allowed"
                  disabled={submitting || !isValid}
                  aria-disabled={submitting || !isValid}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {submitting ? 'Enviando…' : 'Enviar Mensaje'}
                </Button>
                {!isValid && (
                  <p className="text-xs text-muted-foreground text-center">Revisa los campos marcados para continuar.</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact info + FAQ */}
          <div className="space-y-6 sm:space-y-8">
            {/* Email */}
            <Card className="shadow-sm hover:shadow-md border-border/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg grid place-items-center bg-primary/10 ring-1 ring-primary/15">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Email</h3>
                      <a href="mailto:contacto@rogu.com" className="text-primary hover:underline break-all">contacto@rogu.com</a>
                      <div className="text-muted-foreground break-all">soporte@rogu.com</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copy('contacto@rogu.com', 'Email')} className="self-start sm:self-auto">
                    <Copy className="w-4 h-4 mr-1" /> Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Teléfono */}
            <Card className="shadow-sm hover:shadow-md border-border/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg grid place-items-center bg-primary/10 ring-1 ring-primary/15">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Teléfono</h3>
                      <a href="tel:+15551234567" className="text-primary hover:underline">+1 (555) 123-4567</a>
                      <p className="text-sm text-muted-foreground">Lun - Vie: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => copy('+15551234567', 'Teléfono')} className="self-start sm:self-auto">
                    <Copy className="w-4 h-4 mr-1" /> Copiar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Oficina */}
            <Card className="shadow-sm hover:shadow-md border-border/80">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg grid place-items-center bg-primary/10 ring-1 ring-primary/15">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Oficina</h3>
                    <p className="text-muted-foreground">Av. Deportiva 123</p>
                    <p className="text-muted-foreground">Ciudad Deportiva, CP 12345</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="shadow-card-custom border-border">
              <CardHeader>
                <CardTitle className="text-xl">Preguntas Frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">¿Cómo puedo cancelar una reserva?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Puedes cancelar tu reserva desde tu dashboard hasta 2 horas antes del horario reservado.</p>
                </div>
                <hr className="my-2 border-border/60" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">¿Qué métodos de pago aceptan?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Aceptamos tarjetas de crédito, débito y pagos por QR con las principales billeteras digitales.</p>
                </div>
                <hr className="my-2 border-border/60" />
                <div>
                  <h4 className="font-medium text-foreground mb-2">¿Puedo modificar mi reserva?</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Sí, puedes modificar tu reserva sujeto a disponibilidad y políticas de la cancha.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
