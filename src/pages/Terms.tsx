import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-muted-foreground">
            Última actualización: Enero 2024
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span>1. Aceptación de los Términos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-muted-foreground">
                Al acceder y utilizar la plataforma ROGÜ, usted acepta estar sujeto a estos términos y condiciones de uso. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>2. Descripción del Servicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ROGÜ es una plataforma digital que facilita la reserva de espacios deportivos. Nuestros servicios incluyen:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Búsqueda y visualización de canchas deportivas disponibles</li>
                <li>Sistema de reservas en línea</li>
                <li>Procesamiento de pagos seguros</li>
                <li>Gestión de reservas y códigos QR de acceso</li>
                <li>Atención al cliente y soporte técnico</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>3. Registro y Cuenta de Usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Para utilizar nuestros servicios, debe crear una cuenta proporcionando información precisa y actualizada. 
                Usted es responsable de:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Mantener la confidencialidad de su contraseña</li>
                <li>Todas las actividades que ocurran bajo su cuenta</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                <li>Proporcionar información veraz y actualizada</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>4. Reservas y Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">4.1 Proceso de Reserva</h4>
                <p className="text-muted-foreground">
                  Las reservas se confirman una vez completado el pago. Los precios mostrados incluyen todos los impuestos aplicables.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">4.2 Políticas de Cancelación</h4>
                <p className="text-muted-foreground">
                  Las cancelaciones deben realizarse con al menos 2 horas de anticipación para obtener un reembolso completo. 
                  Las cancelaciones tardías pueden estar sujetas a penalizaciones.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">4.3 Métodos de Pago</h4>
                <p className="text-muted-foreground">
                  Aceptamos tarjetas de crédito, débito y pagos digitales. Todos los pagos son procesados de forma segura 
                  a través de proveedores certificados.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>5. Uso de la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Al utilizar ROGÜ, usted se compromete a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Utilizar el servicio solo para fines legítimos</li>
                <li>No interferir con el funcionamiento de la plataforma</li>
                <li>Respetar los derechos de otros usuarios</li>
                <li>Cumplir con las reglas específicas de cada establecimiento</li>
                <li>No realizar actividades fraudulentas o engañosas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>6. Responsabilidades y Limitaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">6.1 Limitación de Responsabilidad</h4>
                <p className="text-muted-foreground">
                  ROGÜ actúa como intermediario entre usuarios y propietarios de canchas. No somos responsables por 
                  las condiciones físicas de las instalaciones o lesiones que puedan ocurrir durante su uso.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">6.2 Disponibilidad del Servicio</h4>
                <p className="text-muted-foreground">
                  Nos esforzamos por mantener la plataforma disponible 24/7, pero no garantizamos un servicio ininterrumpido. 
                  Podemos realizar mantenimientos programados con previo aviso.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>7. Propiedad Intelectual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todos los contenidos de la plataforma ROGÜ, incluyendo textos, gráficos, logos, iconos, imágenes, 
                clips de audio, descargas digitales y software, son propiedad de ROGÜ o sus proveedores de contenido 
                y están protegidos por las leyes de derechos de autor.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>8. Modificaciones de los Términos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones 
                entrarán en vigor inmediatamente después de su publicación en la plataforma. El uso continuado 
                del servicio constituye la aceptación de los términos modificados.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Contacto</h4>
                  <p className="text-muted-foreground">
                    Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en: 
                    <a href="mailto:legal@rogu.com" className="text-primary hover:underline ml-1">
                      legal@rogu.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;