import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { SportCard } from '../components/sports/SportCard';
import { Search, Shield, Clock, Award, Users, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useVenueStore } from '../store/venueStore';
import { useAuthStore } from '../store/authStore';
import type { SportType } from '../types';

const sportsData = [
  {
    sport: 'soccer' as SportType,
    icon: '⚽',
    name: 'Fútbol',
    color: 'hsl(var(--soccer))',
  },
  {
    sport: 'basketball' as SportType,
    icon: '🏀',
    name: 'Básquetbol',
    color: 'hsl(var(--basketball))',
  },
  {
    sport: 'tennis' as SportType,
    icon: '🎾',
    name: 'Tenis',
    color: 'hsl(var(--tennis))',
  },
  {
    sport: 'volleyball' as SportType,
    icon: '🏐',
    name: 'Voleibol',
    color: 'hsl(var(--volleyball))',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { venues } = useVenueStore();
  const { isAuthenticated } = useAuthStore();
  const [searchLocation, setSearchLocation] = React.useState('');

  const handleSearch = (sport?: SportType) => {
    const setFilter = useVenueStore.getState().setFilter;
    setFilter(sport || null, searchLocation);
    if (isAuthenticated) {
      navigate('/venues');
    } else {
      navigate('/auth/login');
    }
  };

  const getSportVenueCount = (sport: SportType) => {
    return venues.filter(venue => venue.sport === sport).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-16 sm:py-24 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mobile-padding">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 mb-6 sm:mb-8 border border-white/20 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium text-primary-foreground">
                La plataforma #1 de reservas deportivas
              </span>
            </div>
          </div>
          
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 sm:mb-8 text-balance">
              Reserva tu cancha deportiva
              <span className="block text-accent bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                en segundos
              </span>
            </h1>
          </div>
          
          <div className="animate-slide-up delay-200">
            <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/90 mb-8 sm:mb-12 max-w-4xl mx-auto text-balance">
              La plataforma más completa para encontrar y reservar espacios deportivos. 
              Conectamos deportistas con las mejores canchas de la ciudad.
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto animate-slide-up delay-300 px-4 sm:px-0">
            <div className="glass rounded-2xl p-4 sm:p-8 shadow-xl border border-white/20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    placeholder="¿Dónde quieres jugar?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="h-12 sm:h-14 pl-12 text-base sm:text-lg rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-all duration-200"
                  />
                </div>
                <Button 
                  onClick={() => handleSearch()}
                  size="lg"
                  className="h-12 sm:h-14 bg-gradient-primary hover:opacity-90 px-6 sm:px-8 rounded-xl font-semibold shadow-glow hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mobile-full-width"
                >
                  <Search className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Buscar Canchas</span>
                  <span className="sm:hidden">Buscar</span>
                </Button>
              </div>
              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-sm text-primary-foreground/80 text-center">
                    <span className="font-medium">¡Inicia sesión</span> para acceder a todas las canchas disponibles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-padding">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="font-semibold text-primary uppercase tracking-wider">
                Deportes Disponibles
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Encuentra tu deporte favorito
            </h2>
            <p className="text-muted-foreground text-base sm:text-xl max-w-3xl mx-auto text-balance">
              Explora nuestra amplia selección de canchas deportivas. 
              {isAuthenticated 
                ? "Haz clic en cualquier deporte para ver las opciones disponibles."
                : "Inicia sesión para acceder a todas las opciones."
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 animate-slide-up mobile-grid-1 mobile-gap-4">
            {sportsData.map((sport) => (
              <SportCard
                key={sport.sport}
                sport={sport.sport}
                icon={sport.icon}
                name={sport.name}
                totalVenues={getSportVenueCount(sport.sport)}
                color={sport.color}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mobile-padding">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-3 py-2 mb-4 sm:mb-6 text-xs sm:text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="font-semibold text-accent uppercase tracking-wider">
                Sobre Nosotros
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4 sm:mb-6 text-balance">
              Conoce ROGÜ
            </h2>
            <p className="text-muted-foreground text-base sm:text-xl max-w-4xl mx-auto text-balance">
              Somos la plataforma líder en reservas de espacios deportivos en Latinoamérica. 
              Nuestra misión es democratizar el acceso al deporte, conectando deportistas apasionados 
              con las mejores canchas de la ciudad de manera fácil, rápida y segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 animate-slide-up mobile-gap-4">
            <Card className="card-modern text-center group">
              <CardContent className="p-6 sm:p-10 mobile-text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  100% Seguro
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Todas nuestras transacciones son seguras y verificamos cada cancha 
                  para garantizar la mejor experiencia deportiva. Tu información está protegida.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center group">
              <CardContent className="p-6 sm:p-10 mobile-text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  Reserva en Segundos
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Nuestra plataforma intuitiva te permite encontrar y reservar 
                  la cancha perfecta en segundos. Confirmación instantánea garantizada.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern text-center group">
              <CardContent className="p-6 sm:p-10 mobile-text-center">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">
                  Miles de Usuarios
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Más de 10,000 deportistas ya confían en ROGÜ. Únete a la comunidad 
                  deportiva más grande y activa de la región.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Stats Section */}
          <div className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-scale-in">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Canchas Disponibles</div>
              </div>
              <div className="animate-scale-in delay-100">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Usuarios Activos</div>
              </div>
              <div className="animate-scale-in delay-200">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Reservas Realizadas</div>
              </div>
              <div className="animate-scale-in delay-300">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-muted-foreground">Calificación Promedio</div>
              </div>
            </div>
          </div>
          
          {/* Learn More Button */}
          <div className="text-center mt-16">
            <Link to="/about">
              <Button variant="outline" size="lg" className="group">
                Conoce más sobre nosotros
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 mobile-padding">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 mb-6 sm:mb-8 border border-white/20 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium text-primary-foreground">
                Únete a la revolución deportiva
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 sm:mb-6 text-balance animate-slide-up">
            ¿Listo para jugar?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground/90 mb-8 sm:mb-12 max-w-3xl mx-auto text-balance animate-slide-up delay-200">
            {isAuthenticated 
              ? "Explora todas las canchas disponibles y reserva tu próximo partido"
              : "Únete a SportsCourt y comienza a reservar canchas deportivas hoy mismo"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center animate-slide-up delay-300 mobile-gap-4">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/venues')}
                className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-primary hover:bg-gray-50 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mobile-full-width"
              >
                <div className="flex items-center gap-2">
                  Ver Canchas Disponibles
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button size="lg" className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-primary hover:bg-gray-50 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mobile-full-width">
                    <div className="flex items-center gap-2">
                      Crear Cuenta Gratis
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 border-2 border-white/30 text-primary-foreground hover:bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mobile-full-width">
                    <div className="flex items-center gap-2">
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;