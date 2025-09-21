import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { SportCard } from '../components/sports/SportCard';
import { Search, Shield, Clock, Users, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useVenueStore } from '../store/venueStore';
import { useAuthStore } from '../store/authStore';
import type { SportType } from '../types';

/**
 * Mejoras aplicadas
 * - Dark mode: paleta oscura coherente, contrastes AA/AAA y estados hover/focus visibles.
 * - Accesibilidad: estructura semántica, labels, descripciones, roles y soporte teclado.
 * - Rendimiento: memo de conteos; callbacks estables; evita recrear handlers por tarjeta.
 * - UX: textos y CTAs consistentes; Enter en búsqueda; avisos claros; animaciones motion-safe.
 * - Limpieza: constantes centralizadas; clases Tailwind normalizadas; pequeños fixes de tipado.
 */

// Paleta y métricas
const STATS = {
  courts: '500+',
  users: '10K+',
  bookings: '50K+',
  rating: '4.8★',
} as const;

const sportsData: Array<{ sport: SportType; icon: string; name: string; color: string }> = [
  { sport: 'soccer', icon: '⚽', name: 'Fútbol', color: '#22c55e' },
  { sport: 'basketball', icon: '🏀', name: 'Básquetbol', color: '#f59e0b' },
  { sport: 'tennis', icon: '🎾', name: 'Tenis', color: '#ef4444' },
  { sport: 'volleyball', icon: '🏐', name: 'Voleibol', color: '#9333ea' },
];

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { venues = [], setFilter } = useVenueStore();
  const { isAuthenticated } = useAuthStore();
  const [searchLocation, setSearchLocation] = React.useState('');

  // Memoiza conteos por deporte para evitar filtros repetidos por render
  const venueCountBySport = React.useMemo(() => {
    const base: Record<SportType, number> = { soccer: 0, basketball: 0, tennis: 0, volleyball: 0 };
    for (const v of venues) {
      const s = v.sport as SportType;
      if (s in base) base[s] += 1;
    }
    return base;
  }, [venues]);

  const goResults = React.useCallback(() => {
    navigate(isAuthenticated ? '/venues' : '/auth/login');
  }, [isAuthenticated, navigate]);

  const handleSearch = React.useCallback(
    (sport?: SportType) => {
      setFilter(sport ?? null, searchLocation.trim());
      goResults();
    },
    [goResults, searchLocation, setFilter]
  );

  // Handler curried para no recrear onClick en cada render del map
  const handleSportSelect = React.useCallback(
    (sport: SportType) => () => handleSearch(sport),
    [handleSearch]
  );

  const onSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleSearch();
    },
    [handleSearch]
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative bg-gradient-to-br from-blue-900 via-blue-900 to-purple-950 py-16 sm:py-20 lg:py-32 overflow-hidden"
      >
        {/* Overlays decorativos */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/90 to-purple-950/90" aria-hidden />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl motion-safe:animate-pulse" aria-hidden />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl motion-safe:animate-pulse motion-safe:animation-delay-1000" aria-hidden />

        <div className="relative container-responsive text-center">
          <div className="motion-safe:animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 sm:mb-8 border border-white/10 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-yellow-300" aria-hidden />
              <span className="font-medium text-white">La plataforma #1 de reservas deportivas</span>
            </div>
          </div>

          <div className="motion-safe:animate-slide-up">
            <h1
              id="hero-title"
              className="heading-responsive-lg font-display font-bold text-white mb-6 sm:mb-8 text-balance"
            >
              Reserva tu cancha deportiva
              <span className="block text-yellow-300 mt-2">en segundos</span>
            </h1>
          </div>

          <p className="motion-safe:animate-slide-up motion-safe:animation-delay-200 text-responsive-lg text-gray-200/90 mb-8 sm:mb-12 max-w-4xl mx-auto text-balance">
            La plataforma más completa para encontrar y reservar espacios deportivos. Conectamos deportistas con las mejores canchas de la ciudad.
          </p>

          {/* Search Bar como formulario para soportar ENTER */}
          <div className="max-w-3xl mx-auto motion-safe:animate-slide-up motion-safe:animation-delay-300 px-4 sm:px-0">
            <form
              onSubmit={onSubmit}
              className="bg-gray-800/95 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-2xl border border-gray-700"
              role="search"
              aria-label="Buscar canchas por ubicación"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
                  <label htmlFor="home-location" className="sr-only">
                    Ubicación
                  </label>
                  <Input
                    id="home-location"
                    placeholder="¿Dónde quieres jugar?"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="h-12 sm:h-14 pl-12 text-base sm:text-lg rounded-xl border-gray-700 bg-gray-900 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/40 transition-all duration-200"
                    autoComplete="address-level2"
                    aria-describedby="home-location-hint"
                  />
                  <p id="home-location-hint" className="sr-only">
                    Escribe tu barrio o ciudad para encontrar canchas cercanas
                  </p>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 sm:h-14 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 px-6 sm:px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-900"
                  aria-label="Buscar canchas"
                >
                  <Search className="w-5 h-5 mr-2" aria-hidden />
                  <span className="hidden sm:inline">Buscar Canchas</span>
                  <span className="sm:hidden">Buscar</span>
                </Button>
              </div>
              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-blue-950/50 rounded-lg border border-blue-900">
                  <p className="text-sm text-blue-200 text-center">
                    <span className="font-medium">¡Inicia sesión</span> para acceder a todas las canchas disponibles!
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Deportes */}
      <section aria-labelledby="sports-title" className="py-16 sm:py-20 bg-gray-900">
        <div className="container-responsive">
          <header className="text-center mb-16 motion-safe:animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-blue-950 rounded-full px-4 py-2 mb-6 text-sm sm:text-base border border-blue-900/60">
              <span className="w-2 h-2 bg-blue-400 rounded-full" aria-hidden />
              <span className="font-semibold text-blue-300 uppercase tracking-wider">Deportes Disponibles</span>
            </div>
            <h2 id="sports-title" className="heading-responsive font-display font-bold text-white mb-6 text-balance">
              Encuentra tu deporte favorito
            </h2>
            <p className="text-responsive-lg text-gray-300 max-w-3xl mx-auto text-balance">
              {isAuthenticated
                ? 'Explora y haz clic en cualquier deporte para ver las opciones disponibles.'
                : 'Inicia sesión para acceder a todas las opciones.'}
            </p>
          </header>

          <div className="grid-responsive motion-safe:animate-slide-up" role="list" aria-label="Listado de deportes">
            {sportsData.map((s) => (
              <div key={s.sport} role="listitem">
                <SportCard
                  sport={s.sport}
                  icon={s.icon}
                  name={s.name}
                  totalVenues={venueCountBySport[s.sport] ?? 0}
                  color={s.color}
                  isAuthenticated={isAuthenticated}
                  onClick={handleSportSelect(s.sport)}
                  aria-label={`Ver canchas de ${s.name}`}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSearch(s.sport);
                    }
                  }}
                  tabIndex={0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section id="about" aria-labelledby="about-title" className="py-16 sm:py-20 bg-gray-950">
        <div className="container-responsive">
          <header className="text-center mb-20 motion-safe:animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-purple-950 rounded-full px-4 py-2 mb-6 text-sm sm:text-base border border-purple-900/60">
              <span className="w-2 h-2 bg-purple-400 rounded-full" aria-hidden />
              <span className="font-semibold text-purple-300 uppercase tracking-wider">Sobre Nosotros</span>
            </div>
            <h2 id="about-title" className="heading-responsive font-display font-bold text-white mb-6 text-balance">
              Conoce ROGÜ
            </h2>
            <p className="text-responsive-lg text-gray-300 max-w-4xl mx-auto text-balance">
              Somos la plataforma líder en reservas de espacios deportivos en Latinoamérica. Nuestra misión es democratizar el acceso al deporte, conectando deportistas apasionados con las mejores canchas de la ciudad de manera fácil, rápida y segura.
            </p>
          </header>

          <div className="grid-responsive-3 motion-safe:animate-slide-up">
            <Card className="text-center group hover:scale-105 hover:-translate-y-2 transition-all duration-300 bg-gray-900 border-gray-800">
              <CardContent className="p-8 sm:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" aria-hidden />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">100% Seguro</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Todas nuestras transacciones son seguras y verificamos cada cancha para garantizar la mejor experiencia deportiva. Tu información está protegida.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 hover:-translate-y-2 transition-all duration-300 bg-gray-900 border-gray-800">
              <CardContent className="p-8 sm:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" aria-hidden />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Reserva en Segundos</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Nuestra plataforma intuitiva te permite encontrar y reservar la cancha perfecta en segundos. Confirmación instantánea garantizada.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover:scale-105 hover:-translate-y-2 transition-all duration-300 bg-gray-900 border-gray-800">
              <CardContent className="p-8 sm:p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" aria-hidden />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Miles de Usuarios</h3>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                  Más de 10,000 deportistas ya confían en ROGÜ. Únete a la comunidad deportiva más grande y activa de la región.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="mt-20" aria-label="Estadísticas de la plataforma">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="motion-safe:animate-scale-in">
                <dt className="text-gray-400 font-medium">Canchas Disponibles</dt>
                <dd className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {STATS.courts}
                </dd>
              </div>
              <div className="motion-safe:animate-scale-in motion-safe:animation-delay-100">
                <dt className="text-gray-400 font-medium">Usuarios Activos</dt>
                <dd className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {STATS.users}
                </dd>
              </div>
              <div className="motion-safe:animate-scale-in motion-safe:animation-delay-200">
                <dt className="text-gray-400 font-medium">Reservas Realizadas</dt>
                <dd className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {STATS.bookings}
                </dd>
              </div>
              <div className="motion-safe:animate-scale-in motion-safe:animation-delay-300">
                <dt className="text-gray-400 font-medium">Calificación Promedio</dt>
                <dd className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {STATS.rating}
                </dd>
              </div>
            </dl>
          </div>

          {/* Learn More */}
          <div className="text-center mt-16">
            <Link to="/about" aria-label="Conoce más sobre ROGÜ">
              <Button
                variant="outline"
                size="lg"
                className="group border-2 border-gray-700 text-gray-200 hover:border-blue-500 hover:text-blue-300"
              >
                Conoce más sobre nosotros
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 sm:py-24 bg-gradient-to-br from-blue-950 via-blue-950 to-purple-950 relative overflow-hidden"
        aria-labelledby="cta-title"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-950/90 to-purple-950/90" aria-hidden />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl" aria-hidden />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl" aria-hidden />

        <div className="relative container-narrow text-center">
          <div className="motion-safe:animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 sm:mb-8 border border-white/10 text-sm sm:text-base">
              <Sparkles className="w-4 h-4 text-yellow-300" aria-hidden />
              <span className="font-medium text-white">Únete a la revolución deportiva</span>
            </div>
          </div>

          <h2 id="cta-title" className="text-3xl sm:text-4xl lg:text-6xl font-display font-bold text-white mb-6 text-balance motion-safe:animate-slide-up">
            ¿Listo para jugar?
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200/90 mb-8 sm:mb-12 max-w-3xl mx-auto text-balance motion-safe:animate-slide-up motion-safe:animation-delay-200">
            {isAuthenticated
              ? 'Explora todas las canchas disponibles y reserva tu próximo partido'
              : 'Únete a ROGÜ y comienza a reservar canchas deportivas hoy mismo'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center motion-safe:animate-slide-up motion-safe:animation-delay-300">
            {isAuthenticated ? (
              <Button
                size="lg"
                onClick={() => navigate('/venues')}
                className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-blue-700 hover:bg-gray-100 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-blue-950"
              >
                <span className="flex items-center gap-2">
                  Ver Canchas Disponibles
                  <ArrowRight className="w-5 h-5" aria-hidden />
                </span>
              </Button>
            ) : (
              <>
                <Link to="/auth/register">
                  <Button
                    size="lg"
                    className="h-12 sm:h-14 px-6 sm:px-8 bg-white text-blue-700 hover:bg-gray-100 rounded-xl font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 focus-visible:ring-offset-blue-950 w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-2">
                      Crear Cuenta Gratis
                      <ArrowRight className="w-5 h-5" aria-hidden />
                    </span>
                  </Button>
                </Link>
                <Link to="/auth/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 sm:h-14 px-6 sm:px-8 border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-base sm:text-lg transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40 focus-visible:ring-offset-blue-950 w-full sm:w-auto"
                  >
                    <span className="flex items-center gap-2">
                      Iniciar Sesión
                      <ArrowRight className="w-5 h-5" aria-hidden />
                    </span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
