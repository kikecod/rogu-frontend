import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { SportCard } from '../components/sports/SportCard';
import { Search, Shield, Clock, Award, Users } from 'lucide-react';
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
    navigate('/venues');
  };

  const getSportVenueCount = (sport: SportType) => {
    return venues.filter(venue => venue.sport === sport).length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Reserva tu cancha deportiva
            <span className="block text-accent">en segundos</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            La plataforma más completa para encontrar y reservar espacios deportivos. 
            Conectamos deportistas con las mejores canchas de la ciudad.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-background/95 backdrop-blur rounded-xl p-6 shadow-sports">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="¿Dónde quieres jugar?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                onClick={() => handleSearch()}
                size="lg"
                className="h-12 bg-gradient-primary hover:opacity-90 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Encuentra tu deporte favorito
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explora nuestra amplia selección de canchas deportivas. 
              Haz clic en cualquier deporte para ver las opciones disponibles.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sportsData.map((sport) => (
              <SportCard
                key={sport.sport}
                sport={sport.sport}
                icon={sport.icon}
                name={sport.name}
                totalVenues={getSportVenueCount(sport.sport)}
                color={sport.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Quiénes somos?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              SportsCourt es la plataforma líder en reservas de espacios deportivos. 
              Conectamos deportistas apasionados con propietarios de canchas, 
              facilitando el acceso al deporte para todos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-border bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Seguro y Confiable
                </h3>
                <p className="text-muted-foreground">
                  Verificamos todas las canchas y propietarios para garantizar 
                  una experiencia segura y confiable para nuestros usuarios.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Reserva Instantánea
                </h3>
                <p className="text-muted-foreground">
                  Reserva tu cancha en tiempo real, selecciona horarios 
                  disponibles y recibe confirmación inmediata.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Comunidad Activa
                </h3>
                <p className="text-muted-foreground">
                  Únete a miles de deportistas que ya confían en nosotros 
                  para encontrar las mejores canchas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-sports">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            ¿Listo para jugar?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            {isAuthenticated 
              ? "Explora todas las canchas disponibles y reserva tu próximo partido"
              : "Únete a SportsCourt y comienza a reservar canchas deportivas hoy mismo"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button 
                size="1g" 
                onClick={() => navigate('/venues')}
                className="bg-background text-primary hover:bg-background/90"
              >
                Ver Canchas Disponibles
              </Button>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button size="lg" className="bg-background text-primary hover:bg-background/90">
                    Crear Cuenta Gratis
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Iniciar Sesión
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