import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';

/**
 * Mejoras clave
 * - Semántica y accesibilidad: <main>, <section>, aria-labelledby, <time>, <address>.
 * - Toc/Índice interno para navegación rápida.
 * - Headings consistentes (h1 único, subsecciones h2/h3/h4).
 * - Links y foco accesible, labels claros.
 * - Copy pulido y estilos compatibles con tu sistema de tokens.
 */

const LAST_UPDATED_ISO = '2024-01-15'; // ajusta la fecha real aquí
const LAST_UPDATED_TEXT = new Date(LAST_UPDATED_ISO).toLocaleDateString('es-ES', {
  year: 'numeric', month: 'long', day: '2-digit'
});

const SectionTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-foreground">{children}</CardTitle>
  </CardHeader>
);

const Privacy: React.FC = () => {
  return (
    <main className="min-h-screen bg-background" aria-labelledby="privacy-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" aria-label="Volver al inicio">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden />
              Volver al inicio
            </Button>
          </Link>
        </nav>

        {/* Hero */}
        <header className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
            <Shield className="w-8 h-8 text-primary-foreground" aria-hidden />
          </div>
          <h1 id="privacy-title" className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
            Política de Privacidad
          </h1>
          <p className="text-lg text-muted-foreground">
            Última actualización: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_TEXT}</time>
          </p>
        </header>

        {/* TOC */}
        <nav aria-label="Índice" className="mb-10">
          <Card className="card-modern">
            <CardContent className="p-4 sm:p-6">
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {[
                  { href: '#info', label: '1. Información que Recopilamos' },
                  { href: '#use', label: '2. Cómo Utilizamos su Información' },
                  { href: '#share', label: '3. Compartir Información' },
                  { href: '#security', label: '4. Seguridad de los Datos' },
                  { href: '#rights', label: '5. Sus Derechos' },
                  { href: '#cookies', label: '6. Cookies y Tecnologías Similares' },
                  { href: '#retention', label: '7. Retención de Datos' },
                  { href: '#changes', label: '8. Cambios en esta Política' },
                  { href: '#contact', label: 'Contacto sobre Privacidad' },
                ].map((i) => (
                  <li key={i.href}>
                    <a href={i.href} className="text-foreground/80 hover:text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">
                      {i.label}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </nav>

        {/* Content */}
        <div className="space-y-8">
          <section id="info" aria-labelledby="info-title">
            <Card className="card-modern">
              <SectionTitle>
                <Eye className="w-5 h-5 text-primary" aria-hidden />
                <span id="info-title">1. Información que Recopilamos</span>
              </SectionTitle>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1.1 Información Personal</h3>
                  <p className="text-muted-foreground mb-2">Recopilamos información que usted nos proporciona directamente, incluyendo:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Nombre completo y datos de contacto</li>
                    <li>Correo electrónico</li>
                    <li>Número de teléfono</li>
                    <li>Información de pago (procesada de forma segura)</li>
                    <li>Preferencias deportivas y de reserva</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1.2 Información de Uso</h3>
                  <p className="text-muted-foreground mb-2">De forma automática, recopilamos datos sobre cómo utiliza nuestros servicios:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Dirección IP y datos de ubicación aproximada</li>
                    <li>Información del dispositivo y navegador</li>
                    <li>Páginas visitadas y tiempo de navegación</li>
                    <li>Patrones de uso y preferencias</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="use" aria-labelledby="use-title">
            <Card className="card-modern">
              <SectionTitle>
                <Database className="w-5 h-5 text-primary" aria-hidden />
                <span id="use-title">2. Cómo Utilizamos su Información</span>
              </SectionTitle>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Utilizamos la información recopilada para:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Procesar y gestionar reservas de canchas</li>
                  <li>Facilitar pagos seguros y emitir comprobantes</li>
                  <li>Brindar soporte y atención al cliente</li>
                  <li>Mejorar nuestros servicios y la experiencia de usuario</li>
                  <li>Enviar notificaciones relevantes sobre sus reservas</li>
                  <li>Personalizar contenido y recomendaciones</li>
                  <li>Cumplir obligaciones legales y regulatorias</li>
                  <li>Prevenir fraudes y garantizar la seguridad</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="share" aria-labelledby="share-title">
            <Card className="card-modern">
              <SectionTitle>
                <UserCheck className="w-5 h-5 text-primary" aria-hidden />
                <span id="share-title">3. Compartir Información</span>
              </SectionTitle>
              <CardContent className="space-y-5 text-muted-foreground">
                <p>No vendemos ni alquilamos su información personal. Solo la compartimos en estos casos:</p>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.1 Proveedores de Servicios</h3>
                  <p>Con proveedores de confianza (pagos, hosting, analítica) bajo contratos y garantías de privacidad.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.2 Propietarios de Canchas</h3>
                  <p>Datos estrictamente necesarios para gestionar su reserva y acceso a las instalaciones.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">3.3 Requisitos Legales</h3>
                  <p>Si la ley lo exige o para proteger derechos, propiedad y seguridad de usuarios y la plataforma.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="security" aria-labelledby="security-title">
            <Card className="card-modern">
              <SectionTitle>
                <Lock className="w-5 h-5 text-primary" aria-hidden />
                <span id="security-title">4. Seguridad de los Datos</span>
              </SectionTitle>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Aplicamos medidas técnicas y organizativas para proteger su información:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Cifrado SSL/TLS en tránsito</li>
                  <li>Almacenamiento seguro y controles de acceso</li>
                  <li>Monitoreo y auditorías periódicas</li>
                  <li>Buenas prácticas de la industria y minimización de datos</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="rights" aria-labelledby="rights-title">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle id="rights-title">5. Sus Derechos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Usted puede:</p>
                <dl className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold text-foreground">Acceso</dt>
                    <dd className="text-muted-foreground">Solicitar una copia de sus datos personales.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Rectificación</dt>
                    <dd className="text-muted-foreground">Corregir información inexacta o incompleta.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Eliminación</dt>
                    <dd className="text-muted-foreground">Solicitar la supresión de su información.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Portabilidad</dt>
                    <dd className="text-muted-foreground">Recibir sus datos en un formato estructurado.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Oposición</dt>
                    <dd className="text-muted-foreground">Oponerse a ciertos tratamientos.</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-foreground">Limitación</dt>
                    <dd className="text-muted-foreground">Restringir el procesamiento en determinadas circunstancias.</dd>
                  </div>
                </dl>
                <p className="text-muted-foreground">
                  Para ejercer sus derechos, escríbanos a
                  {' '}<a href="mailto:privacidad@rogu.com" className="text-primary hover:underline">privacidad@rogu.com</a>.
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="cookies" aria-labelledby="cookies-title">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle id="cookies-title">6. Cookies y Tecnologías Similares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Utilizamos cookies para:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Mantener su sesión y preferencias</li>
                  <li>Analizar el uso del servicio</li>
                  <li>Personalizar su experiencia</li>
                  <li>Mejorar la seguridad</li>
                </ul>
                <p className="text-muted-foreground">Puede controlar las cookies desde su navegador.</p>
              </CardContent>
            </Card>
          </section>

          <section id="retention" aria-labelledby="retention-title">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle id="retention-title">7. Retención de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Conservamos su información el tiempo necesario para los fines descritos, salvo obligación legal de conservarla por más tiempo (p. ej., requisitos contables o fiscales aplicables).
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="changes" aria-labelledby="changes-title">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle id="changes-title">8. Cambios en esta Política</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Podemos actualizar esta política. Le informaremos sobre cambios relevantes publicando la versión vigente y, cuando corresponda, por correo electrónico.
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="contact" aria-labelledby="contact-title">
            <Card className="card-modern border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle id="contact-title" className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" aria-hidden />
                  Contacto sobre Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2 text-muted-foreground">
                  <address className="not-italic">
                    <div>
                      <strong>Email:</strong>{' '}
                      <a href="mailto:privacidad@rogu.com" className="text-primary hover:underline">privacidad@rogu.com</a>
                    </div>
                    <div>
                      <strong>Dirección:</strong> Av. Deportiva 123, Ciudad Deportiva, CP 12345
                    </div>
                  </address>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
