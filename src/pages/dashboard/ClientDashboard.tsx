
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { useVenueStore } from '../../store/venueStore';
import { Calendar, MapPin, Clock, Plus, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const { reservations } = useReservationStore();
  const { venues } = useVenueStore();

  const userReservations = reservations.filter(r => r.clientId === user?.id);
  const upcomingReservations = userReservations.filter(r => 
    r.status === 'confirmed' && new Date(r.date) >= new Date()
  ).slice(0, 3);

  const getVenueName = (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    return venue?.name || 'Cancha no encontrada';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'cancelled':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Gestiona tus reservas y encuentra nuevas canchas para jugar
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/venues">
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-sports hover:scale-105 border-border bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nueva Reserva</h3>
                <p className="text-primary-foreground/80">Encuentra y reserva canchas</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/client/reservations">
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-card-custom hover:scale-105 border-border">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Mis Reservas</h3>
                <p className="text-muted-foreground">Ver todas las reservas</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer transition-all duration-300 hover:shadow-card-custom hover:scale-105 border-border">
            <CardContent className="p-6 text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2 text-foreground">Favoritos</h3>
              <p className="text-muted-foreground">Canchas guardadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{userReservations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Reservas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {userReservations.filter(r => r.status === 'confirmed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Confirmadas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {userReservations.filter(r => r.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Favoritos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Reservations */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-foreground">Próximas Reservas</CardTitle>
                <CardDescription>Tus reservas confirmadas para los próximos días</CardDescription>
              </div>
              <Link to="/dashboard/client/reservations">
                <Button variant="outline">Ver todas</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{getVenueName(reservation.venueId)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(reservation.date), 'EEEE, d MMMM yyyy', { locale: es })}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {reservation.timeSlots.join(' - ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(reservation.status)}>
                        {getStatusLabel(reservation.status)}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        ${reservation.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No tienes reservas próximas
                </h3>
                <p className="text-muted-foreground mb-4">
                  ¡Es hora de planificar tu próximo partido!
                </p>
                <Link to="/venues">
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Explorar Canchas
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;