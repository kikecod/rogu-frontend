import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { useVenueStore } from '../../store/venueStore';
import { Calendar, MapPin, Clock, Plus, Heart, ChevronRight } from 'lucide-react';
import { format, isAfter, startOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../lib/utils';

const statusStyle: Record<string, string> = {
  confirmed: 'bg-success text-success-foreground',
  pending: 'bg-warning text-foreground',
  cancelled: 'bg-destructive text-destructive-foreground',
};

const statusLabel: Record<string, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
};

const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { reservations } = useReservationStore();
  const { venues } = useVenueStore();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return '¡Buenos días';
    if (h < 19) return '¡Buenas tardes';
    return '¡Buenas noches';
  }, []);

  // Índices para búsquedas rápidas
  const venueById = useMemo(() => {
    const map = new Map<string, { id: string; name: string; location?: string }>();
    venues.forEach(v => map.set(v.id, { id: v.id, name: v.name, location: v.location }));
    return map;
  }, [venues]);

  const userReservations = useMemo(
    () => reservations.filter(r => r.clientId === user?.id),
    [reservations, user?.id]
  );

  const counts = useMemo(() => ({
    total: userReservations.length,
    confirmed: userReservations.filter(r => r.status === 'confirmed').length,
    pending: userReservations.filter(r => r.status === 'pending').length,
    favourites: 0, // si más adelante agregas favoritos, cámbialo aquí
  }), [userReservations]);

  const upcomingReservations = useMemo(() => {
    const today = startOfDay(new Date());
    return userReservations
      .filter(r => r.status === 'confirmed' && isAfter(parseISO(r.date), today))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))
      .slice(0, 4);
  }, [userReservations]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
            {greeting}, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus reservas y descubre nuevas canchas para jugar.
          </p>
        </header>

        {/* Quick Actions */}
        <section
          aria-label="Acciones rápidas"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8"
        >
          <Link to="/venues" className="group">
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-sports hover:scale-[1.02] border-border bg-gradient-to-br from-primary to-primary-dark text-primary-foreground">
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl bg-primary-foreground/15 grid place-items-center">
                  <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Nueva Reserva</h3>
                <p className="text-primary-foreground/85 text-sm">Encuentra y reserva canchas</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/client/reservations" className="group">
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-card-custom hover:scale-[1.02] border-border">
              <CardContent className="p-5 sm:p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-primary" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Mis Reservas</h3>
                <p className="text-muted-foreground text-sm">Historial y próximas reservas</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer transition-all duration-300 hover:shadow-card-custom hover:scale-[1.02] border-border">
            <CardContent className="p-5 sm:p-6 text-center">
              <Heart className="w-12 h-12 mx-auto mb-3 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">Favoritos</h3>
              <p className="text-muted-foreground text-sm">Canchas guardadas</p>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section aria-label="Estadísticas" className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            icon={<Calendar className="w-6 h-6 text-primary" />}
            iconBg="bg-primary/10"
            value={counts.total}
            label="Total reservas"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-success" />}
            iconBg="bg-success/10"
            value={counts.confirmed}
            label="Confirmadas"
          />
          <StatCard
            icon={<MapPin className="w-6 h-6 text-warning" />}
            iconBg="bg-warning/10"
            value={counts.pending}
            label="Pendientes"
          />
          <StatCard
            icon={<Heart className="w-6 h-6 text-accent" />}
            iconBg="bg-accent/10"
            value={counts.favourites}
            label="Favoritos"
          />
        </section>

        {/* Upcoming */}
        <section aria-label="Próximas reservas">
          <Card className="border-border">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-foreground">Próximas reservas</CardTitle>
                <CardDescription>Tus reservas confirmadas para los próximos días</CardDescription>
              </div>
              <Link to="/dashboard/client/reservations">
                <Button variant="outline" className="gap-1">
                  Ver todas
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {upcomingReservations.length > 0 ? (
                <ul className="space-y-4">
                  {upcomingReservations.map((r) => {
                    const venue = venueById.get(r.venueId);
                    const date = parseISO(r.date);
                    return (
                      <li
                        key={r.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-border rounded-xl bg-card"
                      >
                        {/* left */}
                        <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 grid place-items-center flex-shrink-0">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground leading-tight">
                              {venue?.name ?? 'Cancha no encontrada'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(date, "EEEE d 'de' MMMM yyyy", { locale: es })}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{r.timeSlots.join(' · ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* right */}
                        <div className="text-left sm:text-right">
                          <Badge className={cn('px-2.5 py-1 text-xs font-medium rounded-md', statusStyle[r.status] || 'bg-muted text-foreground')}>
                            {statusLabel[r.status] ?? r.status}
                          </Badge>
                          <p className="text-sm font-semibold text-foreground mt-1">
                            ${r.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-muted grid place-items-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">No tienes reservas próximas</h3>
                  <p className="text-muted-foreground mb-4">¡Es hora de planificar tu próximo partido!</p>
                  <Link to="/venues">
                    <Button className="bg-gradient-primary hover:opacity-90">Explorar canchas</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  iconBg: string;
  value: number | string;
  label: string;
}> = ({ icon, iconBg, value, label }) => (
  <Card className="border-border">
    <CardContent className="p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className={cn('w-12 h-12 rounded-lg grid place-items-center', iconBg)}>{icon}</div>
        <div>
          <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ClientDashboard;
