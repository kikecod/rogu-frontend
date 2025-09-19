import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Users, Target, Award, Heart, Shield, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
            Quiénes Somos
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ROGÜ es la plataforma líder en reservas de espacios deportivos, 
            conectando deportistas apasionados con las mejores canchas de la ciudad.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="card-modern">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Democratizar el acceso al deporte facilitando la reserva de espacios deportivos 
                de calidad, promoviendo un estilo de vida activo y saludable para toda la comunidad.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Nuestra Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma de referencia en Latinoamérica para la reserva de espacios deportivos, 
                creando una comunidad activa y conectada a través del deporte.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Confianza</h4>
                <p className="text-muted-foreground text-sm">
                  Garantizamos transacciones seguras y espacios verificados para tu tranquilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Eficiencia</h4>
                <p className="text-muted-foreground text-sm">
                  Reserva en segundos con nuestra plataforma intuitiva y rápida.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground mb-2">Pasión</h4>
                <p className="text-muted-foreground text-sm">
                  Amamos el deporte y trabajamos para que tú también puedas disfrutarlo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Equipo de Desarrollo</h4>
                <p className="text-muted-foreground text-sm">
                  Desarrolladores apasionados por crear la mejor experiencia tecnológica.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Atención al Cliente</h4>
                <p className="text-muted-foreground text-sm">
                  Siempre listos para ayudarte con cualquier consulta o problema.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center">
              <CardContent className="p-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Gestión de Calidad</h4>
                <p className="text-muted-foreground text-sm">
                  Verificamos cada cancha para garantizar la mejor experiencia deportiva.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            ¿Listo para unirte a ROGÜ?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de deportistas que ya confían en nosotros para encontrar 
            las mejores canchas deportivas.
          </p>
          <Link to="/auth/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-50">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;