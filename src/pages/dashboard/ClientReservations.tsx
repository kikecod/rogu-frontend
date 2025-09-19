import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';

const ClientReservations = () => {
  const { user } = useAuthStore();
  const { getUserReservations } = useReservationStore();
  
  const userReservations = getUserReservations(user?.id || '');
  
  const upcomingReservations = userReservations.filter(r => 
    r.status === 'confirmed' && new Date(r.date) >= new Date()
  );
  
  const pastReservations = userReservations.filter(r => 
    r.status === 'completed' || new Date(r.date) < new Date()
  );
  
  const pendingReservations = userReservations.filter(r => r.status === 'pending');
  const cancelledReservations = userReservations.filter(r => r.status === 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/client">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mis Reservas</h1>
              <p className="text-muted-foreground">
                Gestiona todas tus reservas de canchas deportivas
              </p>
            </div>
          </div>
          
          <Link to="/venues">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reserva
            </Button>
          </Link>
        </div>

        {/* Reservations Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Próximas ({upcomingReservations.length})</span>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendientes ({pendingReservations.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Pasadas ({pastReservations.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Canceladas ({cancelledReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
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
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {pendingReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tienes reservas pendientes
                </h3>
                <p className="text-muted-foreground">
                  Todas tus reservas están confirmadas o completadas
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            {pastReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tienes reservas pasadas
                </h3>
                <p className="text-muted-foreground">
                  Tus reservas completadas aparecerán aquí
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            {cancelledReservations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cancelledReservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tienes reservas canceladas
                </h3>
                <p className="text-muted-foreground">
                  ¡Perfecto! Todas tus reservas siguen activas
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientReservations;