import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '../../components/ui/dialog';
import { QRCodeDisplay } from '../../components/qr/QRCodeDisplay';
import { Calendar, Clock, MapPin, Users, QrCode, X, Copy, ExternalLink } from 'lucide-react';
import { useReservationStore } from '../../store/reservationStore';
import { useVenueStore } from '../../store/venueStore';
import { useToast } from '../../hooks/use-toast';
import type { Reservation } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../lib/utils';

type Status = 'confirmed' | 'pending' | 'cancelled' | 'completed';

interface ReservationCardProps {
  reservation: Reservation;
  /** Mostrar botón “Ver cancha” que navegue a /venues/:id (si la tienes) */
  onOpenVenue?: (venueId: string) => void;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  confirmed: 'bg-success text-white',
  pending: 'bg-warning text-white',
  cancelled: 'bg-destructive text-white',
  completed: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<Status, string> = {
  confirmed: 'Confirmada',
  pending: 'Pendiente',
  cancelled: 'Cancelada',
  completed: 'Completada',
};

const peso = (v: number | undefined) =>
  typeof v === 'number' ? `$${v.toLocaleString()}` : '—';

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reservation,
  onOpenVenue,
  className,
}) => {
  const { toast } = useToast();
  const { cancelReservation } = useReservationStore();
  const { venues } = useVenueStore();
  const [showQR, setShowQR] = React.useState(false);

  const venue = venues.find(v => v.id === reservation.venueId);
  const venueName = venue?.name ?? 'Cancha no disponible';
  const venueLocation = venue?.location ?? '—';
  const pricePerHour = venue?.pricePerHour;

  const dateObj = new Date(reservation.date);
  const dateLabel = isNaN(dateObj.getTime())
    ? reservation.date
    : format(dateObj, "EEEE d 'de' MMMM yyyy", { locale: es });

  const isPastDate = !isNaN(dateObj.getTime()) && dateObj < new Date();

  const canCancel = reservation.status === 'confirmed' && !isPastDate;
  const canShowQR = reservation.status === 'confirmed';

  const handleCancel = () => {
    if (!canCancel) return;
    if (window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      cancelReservation(reservation.id);
      toast({
        title: 'Reserva cancelada',
        description: 'Tu reserva ha sido cancelada exitosamente.',
      });
    }
  };

  const handleCopy = async () => {
    const summary = [
      `Reserva - ${venueName}`,
      `Fecha: ${dateLabel}`,
      `Horario: ${reservation.timeSlots.join(' - ')}`,
      `Ubicación: ${venueLocation}`,
      `Participantes: ${reservation.participants.length}`,
      `Total: ${peso(reservation.totalPrice)} (${reservation.totalHours}h × ${peso(pricePerHour)}/h)`,
      `Estado: ${statusLabels[reservation.status as Status] ?? reservation.status}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      toast({ title: 'Copiado', description: 'Resumen de la reserva copiado al portapapeles.' });
    } catch {
      toast({ title: 'No se pudo copiar', description: 'Inténtalo nuevamente.', variant: 'destructive' });
    }
  };

  const openVenue = () => {
    if (onOpenVenue && venue?.id) onOpenVenue(venue.id);
  };

  return (
    <Card className={cn('border-border bg-card shadow-card-custom', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg text-foreground truncate">{venueName}</CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="whitespace-nowrap">{dateLabel}</span>
              </div>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <div className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="whitespace-nowrap">{reservation.timeSlots.join(' - ')}</span>
              </div>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="truncate">{venueLocation}</span>
              </div>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <div className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{reservation.participants.length} participante{reservation.participants.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>

          <Badge className={statusStyles[reservation.status as Status] ?? 'bg-muted text-muted-foreground'}>
            {statusLabels[reservation.status as Status] ?? reservation.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Precio + acciones */}
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-border pt-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-bold text-foreground">{peso(reservation.totalPrice)}</p>
            <p className="text-xs text-muted-foreground">
              {reservation.totalHours}h × {peso(pricePerHour)}/h
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenVenue && venue?.id && (
              <Button variant="outline" size="sm" onClick={openVenue} aria-label="Ver cancha">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver cancha
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleCopy} aria-label="Copiar resumen">
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>

            {canShowQR && (
              <Dialog open={showQR} onOpenChange={setShowQR}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" aria-haspopup="dialog" aria-expanded={showQR}>
                    <QrCode className="mr-2 h-4 w-4" />
                    QR
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogTitle>Código QR — {venueName}</DialogTitle>
                  <QRCodeDisplay reservation={reservation} venueName={venueName} />
                </DialogContent>
              </Dialog>
            )}

            {canCancel && (
              <Button size="sm" variant="destructive" onClick={handleCancel} aria-label="Cancelar reserva">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
          </div>
        </div>

        {/* Participantes */}
        {reservation.participants.length > 0 && (
          <div className="border-t border-border pt-3">
            <h4 className="mb-2 text-sm font-medium text-foreground">Participantes</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {reservation.participants.map((p, idx) => (
                <li key={`${p.name}-${idx}`}>
                  {p.name}
                  {p.phone && <span className="ml-2 text-xs">({p.phone})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
