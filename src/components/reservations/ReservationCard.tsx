import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '../../components/ui/dialog';
import { DialogTitle } from '../../components/ui/dialog';
import { QRCodeDisplay } from '../../components/qr/QRCodeDisplay';
import { Calendar, Clock, MapPin, Users, QrCode, X } from 'lucide-react';
import { useReservationStore } from '../../store/reservationStore';
import { useVenueStore } from '../../store/venueStore';
import { useToast } from '../../hooks/use-toast';
import type { Reservation } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


interface ReservationCardProps {
  reservation: Reservation;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const { toast } = useToast();
  const { cancelReservation } = useReservationStore();
  const { venues } = useVenueStore();
  const [showQR, setShowQR] = useState(false);

  const venue = venues.find(v => v.id === reservation.venueId);
  const venueName = venue?.name || 'Cancha no encontrada';

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelReservation(reservation.id);
      toast({
        title: "Reserva cancelada",
        description: "Tu reserva ha sido cancelada exitosamente",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'cancelled':
        return 'bg-destructive text-white';
      case 'completed':
        return 'bg-muted text-muted-foreground';
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
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const isPastDate = new Date(reservation.date) < new Date();
  const canCancel = reservation.status === 'confirmed' && !isPastDate;
  const canShowQR = reservation.status === 'confirmed';

  return (
    <Card className="border-border bg-card shadow-card-custom">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-foreground">{venueName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(reservation.date), 'EEEE, d MMMM yyyy', { locale: es })}
            </p>
          </div>
          <Badge className={getStatusColor(reservation.status)}>
            {getStatusLabel(reservation.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {reservation.timeSlots.join(' - ')}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {reservation.participants.length} participantes
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-lg font-bold text-foreground">
              ${reservation.totalPrice.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {reservation.totalHours}h × ${venue?.pricePerHour.toLocaleString()}/h
            </p>
          </div>
          
          <div className="flex space-x-2">
            {canShowQR && (
              <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <QrCode className="w-4 h-4 mr-1" />
                    QR
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogTitle>Código QR - {venueName}</DialogTitle>
                  <QRCodeDisplay reservation={reservation} venueName={venueName} />
                </DialogContent>
              </Dialog>
            )}
            
            {canCancel && (
              <Button size="sm" variant="destructive" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
        
        {reservation.participants.length > 0 && (
          <div className="pt-2 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Participantes:</h4>
            <div className="space-y-1">
              {reservation.participants.map((participant, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {participant.name}
                  {participant.phone && (
                    <span className="ml-2 text-xs">({participant.phone})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};