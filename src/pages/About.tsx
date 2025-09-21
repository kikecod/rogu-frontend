import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  ArrowLeft,
  Users,
  Target,
  Award,
  Heart,
  Shield,
  Clock,
} from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "Quiénes Somos — ROGÜ";
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero decor: blobs sutiles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-40 bg-gradient-primary blur-[80px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header simple */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" aria-label="Volver al inicio">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* HERO */}
        <header className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4">
            Quiénes Somos
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            ROGÜ es la plataforma líder en reservas de espacios deportivos,
            conectando deportistas apasionados con las mejores canchas de la ciudad.
          </p>
        </header>

        {/* MISIÓN y VISIÓN */}
        <section
          aria-labelledby="mv-title"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16"
        >
          <h2 id="mv-title" className="sr-only">
            Misión y visión
          </h2>

          <Card className="card-modern hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nuestra Misión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Democratizar el acceso al deporte facilitando la reserva de espacios
                de calidad y promoviendo un estilo de vida activo para toda la comunidad.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Nuestra Visión</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser la plataforma de referencia en Latinoamérica para reservar espacios
                deportivos y crear una comunidad activa y conectada a través del deporte.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* VALORES */}
        <section aria-labelledby="values-title" className="mb-16">
          <h2 id="values-title" className="text-3xl font-bold text-center mb-10">
            Nuestros Valores
          </h2>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" role="list">
            <li>
              <Card className="card-modern text-center hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Confianza</h3>
                  <p className="text-muted-foreground text-sm">
                    Transacciones seguras y espacios verificados para tu tranquilidad.
                  </p>
                </CardContent>
              </Card>
            </li>

            <li>
              <Card className="card-modern text-center hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Eficiencia</h3>
                  <p className="text-muted-foreground text-sm">
                    Reserva en segundos con una experiencia rápida e intuitiva.
                  </p>
                </CardContent>
              </Card>
            </li>

            <li>
              <Card className="card-modern text-center hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pasión</h3>
                  <p className="text-muted-foreground text-sm">
                    Amamos el deporte y trabajamos para que tú también lo disfrutes.
                  </p>
                </CardContent>
              </Card>
            </li>
          </ul>
        </section>

        {/* EQUIPO */}
        <section aria-labelledby="team-title" className="mb-16">
          <h2 id="team-title" className="text-3xl font-bold text-center mb-10">
            Nuestro Equipo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <article className="card-modern text-center hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Equipo de Desarrollo</h3>
                <p className="text-muted-foreground text-sm">
                  Creamos experiencias rápidas, accesibles y seguras.
                </p>
              </CardContent>
            </article>

            <article className="card-modern text-center hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Atención al Cliente</h3>
                <p className="text-muted-foreground text-sm">
                  Siempre listos para ayudarte con cualquier consulta.
                </p>
              </CardContent>
            </article>

            <article className="card-modern text-center hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Gestión de Calidad</h3>
                <p className="text-muted-foreground text-sm">
                  Verificamos cada cancha para garantizar la mejor experiencia.
                </p>
              </CardContent>
            </article>
          </div>
        </section>

        {/* CTA */}
        <section
          aria-labelledby="cta-title"
          className="relative bg-gradient-hero rounded-2xl p-8 sm:p-12 overflow-hidden"
        >
          <h2 id="cta-title" className="text-3xl font-bold text-primary-foreground mb-3">
            ¿Listo para unirte a ROGÜ?
          </h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl">
            Únete a miles de deportistas que encuentran su cancha ideal con nosotros.
          </p>
          <Link to="/auth/register">
            <Button
              size="lg"
              className="bg-white/95 text-primary hover:bg-white shadow-lg hover:shadow-xl transition-all"
            >
              Comenzar Ahora
            </Button>
          </Link>

          {/* Glow decorativo */}
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        </section>
      </div>
    </main>
  );
};

export default About;