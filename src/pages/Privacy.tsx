import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';

const Privacy = () => {
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
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-muted-foreground">
            Última actualización: Enero 2024
          </p>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <span>1. Información que Recopilamos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">1.1 Información Personal</h4>
                <p className="text-muted-foreground mb-2">
                  Recopilamos información que usted nos proporciona directamente, incluyendo:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Nombre completo y información de contacto</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información de pago (procesada de forma segura)</li>
                  <li>Preferencias deportivas y de reserva</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">1.2 Información de Uso</h4>
                <p className="text-muted-foreground mb-2">
                  Automáticamente recopilamos información sobre cómo utiliza nuestros servicios:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                  <li>Direcciones IP y datos de ubicación</li>
                  <li>Información del dispositivo y navegador</li>
                  <li>Páginas visitadas y tiempo de navegación</li>
                  <li>Patrones de uso y preferencias</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-primary" />
                <span>2. Cómo Utilizamos su Información</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Utilizamos la información recopilada para los siguientes propósitos:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Procesar y gestionar sus reservas de canchas deportivas</li>
                <li>Facilitar pagos seguros y generar facturas</li>
                <li>Proporcionar atención al cliente y soporte técnico</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
                <li>Enviar notificaciones importantes sobre sus reservas</li>
                <li>Personalizar contenido y recomendaciones</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Prevenir fraudes y garantizar la seguridad de la plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>3. Compartir Información</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-2">3.1 Proveedores de Servicios</h4>
                <p className="text-muted-foreground">
                  Compartimos información con proveedores de confianza que nos ayudan a operar nuestros servicios, 
                  como procesadores de pagos, servicios de hosting y análisis.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">3.2 Propietarios de Canchas</h4>
                <p className="text-muted-foreground">
                  Compartimos información necesaria de reserva con los propietarios de las canchas para facilitar 
                  el acceso y uso de las instalaciones.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">3.3 Requisitos Legales</h4>
                <p className="text-muted-foreground">
                  Podemos divulgar información cuando sea requerido por ley o para proteger nuestros derechos, 
                  propiedad o seguridad.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-primary" />
                <span>4. Seguridad de los Datos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Encriptación SSL/TLS para todas las transmisiones de datos</li>
                <li>Almacenamiento seguro en servidores protegidos</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Cumplimiento con estándares de la industria</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>5. Sus Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Usted tiene los siguientes derechos respecto a su información personal:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de la información que tenemos sobre usted</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de su información personal</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
                <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Para ejercer estos derechos, contáctenos en: 
                <a href="mailto:privacidad@rogu.com" className="text-primary hover:underline ml-1">
                  privacidad@rogu.com
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>6. Cookies y Tecnologías Similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Utilizamos cookies y tecnologías similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Mantener su sesión activa y preferencias</li>
                <li>Analizar el uso de nuestros servicios</li>
                <li>Personalizar su experiencia</li>
                <li>Mejorar la seguridad de la plataforma</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Puede controlar las cookies a través de la configuración de su navegador.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>7. Retención de Datos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos 
                descritos en esta política, a menos que la ley requiera o permita un período de retención más largo. 
                Los datos de reservas se mantienen por razones contables y legales según las regulaciones aplicables.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardHeader>
              <CardTitle>8. Cambios en esta Política</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos sobre cambios 
                significativos publicando la nueva política en nuestro sitio web y, cuando sea apropiado, 
                enviándole una notificación por correo electrónico.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Contacto sobre Privacidad</h4>
                  <p className="text-muted-foreground">
                    Si tiene preguntas sobre esta política de privacidad o el manejo de sus datos personales, 
                    puede contactarnos en:
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> 
                      <a href="mailto:privacidad@rogu.com" className="text-primary hover:underline ml-1">
                        privacidad@rogu.com
                      </a>
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Dirección:</strong> Av. Deportiva 123, Ciudad Deportiva, CP 12345
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;