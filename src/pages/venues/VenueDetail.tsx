import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { TimeSlotSelector } from '../../components/reservation/TimeSlotSelector';
import { ParticipantsList } from '../../components/reservation/ParticipantsList';
import { PaymentOptions } from '../../components/reservation/PaymentOptions';
import { useVenueStore } from '../../store/venueStore';
import { useReservationStore } from '../../store/reservationStore';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/use-toast';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  CheckCircle,
  Wifi,
  Car,
  Coffee,
  ImageOff,
} from 'lucide-react';
import { format, isSameDay, isAfter, startOfDay, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import type { Participant } from '../../types';

/* =========================================================
   VenueDetailPlus – UX mejorada, validaciones y accesibilidad
   - Bloquea fechas pasadas y fuera de ventana (hoy → +90d)
   - Comprueba solapes con reservas existentes del venue
   - Valida que los bloques horarios sean contiguos (opcional)
   - Placeholders/Skeletons simples y estados vacíos
   - Botones y labels accesibles; toasts consistentes
   ========================================================= */

const sportLabels: Record<string, string> = {
  soccer: 'Fútbol',
  basketball: 'Básquetbol',
  tennis: 'Tenis',
  volleyball: 'Voleibol',
};

const sportColors: Record<string, string> = {
  soccer: 'hsl(var(--sports-soccer))',
  basketball: 'hsl(var(--sports-basketball))',
  tennis: 'hsl(var(--sports-tennis))',
  volleyball: 'hsl(var(--sports-volleyball))',
};

const amenityIcons: { [key: string]: React.ReactNode } = {
  Vestuarios: <Users className="w-4 h-4" />,
  Estacionamiento: <Car className="w-4 h-4" />,
  Wifi: <Wifi className="w-4 h-4" />,
  Cafetería: <Coffee className="w-4 h-4" />,
};

// Util: convierte "08:00" a número 800 para ordenación simple
const timeToNumber = (t: string) => parseInt(t.replace(':', ''), 10);

const VENUE_BOOK_AHEAD_DAYS = 90;

const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Algunos stores no exponen isLoading; lo volvemos opcional
const venueStore = useVenueStore();
const venues = venueStore.venues;
const venuesLoading = (venueStore as any).isLoading ?? false;
  // En algunos proyectos, reservations no existe en el store o cambia el nombre.
const resStore = useReservationStore() as any;
const addReservation = resStore.addReservation;
const reservations = (resStore.reservations ?? []) as Array<any>;
  const { user, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate('/auth/login');
  }, [isAuthenticated, navigate]);

  // Find the venue (memo para evitar recalcular)
  const venue = useMemo(() => venues.find((v) => v.id === id), [venues, id]);

  // Reservation state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'qr'>('traditional');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restricciones de calendario
  const minDate = useMemo(() => startOfDay(new Date()), []);
  const maxDate = useMemo(() => addDays(minDate, VENUE_BOOK_AHEAD_DAYS), [minDate]);

  // Reservas existentes para la cancha (para detectar solapes)
  const venueReservations = useMemo(
    () => reservations.filter((r) => r.venueId === id),
    [reservations, id]
  );

  const timeSlotsOverlap = useCallback(
    (a: string[], b: string[]) => a.some((slot) => b.includes(slot)),
    []
  );

  const hasConflict = useMemo(() => {
    if (!selectedDate || selectedTimeSlots.length === 0) return false;
    return venueReservations.some(
      (r) => isSameDay(new Date(r.date), selectedDate) && timeSlotsOverlap(r.timeSlots, selectedTimeSlots)
    );
  }, [selectedDate, selectedTimeSlots, timeSlotsOverlap, venueReservations]);

  const areContiguous = useMemo(() => {
    if (selectedTimeSlots.length <= 1) return true;
    const nums = [...selectedTimeSlots].map(timeToNumber).sort((a, b) => a - b);
    // Asumimos slots de 1h: 0800, 0900, 1000...
    return nums.every((n, i) => (i === 0 ? true : n - nums[i - 1] === 100));
  }, [selectedTimeSlots]);

  const totalPrice = useMemo(
    () => (venue ? selectedTimeSlots.length * venue.pricePerHour : 0),
    [selectedTimeSlots.length, venue]
  );

  const canReserve = Boolean(
    selectedDate &&
      selectedTimeSlots.length > 0 &&
      participants.length > 0 &&
      !isSubmitting &&
      !hasConflict &&
      areContiguous
  );

  const handleReservation = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Inicia sesión requerida',
        description: 'Debes iniciar sesión para hacer una reserva',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (!venue) return;

    if (!selectedDate || selectedTimeSlots.length === 0 || participants.length === 0) {
      toast({
        title: 'Datos incompletos',
        description: 'Completa fecha, horarios y participantes',
        variant: 'destructive',
      });
      return;
    }

    if (!areContiguous) {
      toast({
        title: 'Horarios no contiguos',
        description: 'Selecciona bloques consecutivos para evitar huecos',
      });
      return;
    }

    if (hasConflict) {
      toast({
        title: 'Horario ocupado',
        description: 'Alguno de los bloques seleccionados ya está reservado',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const totalHours = selectedTimeSlots.length;
      const totalPrice = totalHours * venue.pricePerHour;

      addReservation({
        venueId: venue.id,
        clientId: user!.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlots: selectedTimeSlots,
        totalHours,
        totalPrice,
        status: 'confirmed',
        participants,
        paymentMethod,
      });

      toast({
        title: '¡Reserva confirmada!',
        description: `Tu reserva para ${venue.name} está lista`,
      });

      navigate('/dashboard/client/reservations');
    } catch (error) {
      toast({
        title: 'Error en la reserva',
        description: 'No se pudo procesar tu reserva. Inténtalo nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si el store aún carga
  if (venuesLoading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="animate-pulse text-muted-foreground">Cargando cancha…</div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Cancha no encontrada</h2>
          <p className="text-muted-foreground mb-4">La cancha que buscas no existe</p>
          <Button onClick={() => navigate('/venues')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a las canchas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mobile-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => navigate('/venues')} aria-label="Volver a la lista">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{venue.name}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Reserva tu espacio deportivo</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Venue Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Venue Images */}
            <Card className="border-border overflow-hidden">
              <div className="relative">
                {venue.images?.[0] ? (
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-48 sm:h-64 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 grid place-items-center bg-muted/40 text-muted-foreground">
                    <ImageOff className="h-6 w-6" />
                  </div>
                )}
                <Badge
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white font-medium text-xs sm:text-sm"
                  style={{ backgroundColor: sportColors[venue.sport] }}
                >
                  {sportLabels[venue.sport] ?? venue.sport}
                </Badge>
              </div>
            </Card>

            {/* Venue Details */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>{venue.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm sm:text-base font-medium">{venue.rating}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground">({venue.totalReviews})</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">{venue.location}</span>
                </div>

                {venue.description && (
                  <p className="text-muted-foreground text-sm sm:text-base">{venue.description}</p>
                )}

                {venue.amenities?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Servicios disponibles:</h4>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {venue.amenities.map((amenity: string, index: number) => (
                        <Badge key={`${amenity}-${index}`} variant="outline" className="flex items-center gap-1 text-xs">
                          {amenityIcons[amenity] || <CheckCircle className="w-4 h-4" />}
                          <span>{amenity}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-primary/5 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Precio por hora:</h4>
                  <p className="text-xl sm:text-2xl font-bold text-primary">${venue.pricePerHour.toLocaleString()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Horarios: {venue.workingHours.start} - {venue.workingHours.end}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reservation Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Date Selection */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <span>Selecciona la fecha</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal h-10 sm:h-auto text-sm sm:text-base',
                        !selectedDate && 'text-muted-foreground'
                      )}
                      aria-label="Abrir calendario"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
                      ) : (
                        <span>Selecciona una fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isAfter(minDate, date) || isAfter(date, maxDate)}
                      initialFocus
                      className={cn('p-3 pointer-events-auto')}
                    />
                    <div className="px-3 pb-3 pt-2 text-[11px] text-muted-foreground">
                      Disponibilidad entre hoy y {format(maxDate, 'd MMM', { locale: es })}
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Time Slots */}
            {selectedDate && (
              <TimeSlotSelector
                selectedSlots={selectedTimeSlots}
                onSlotsChange={setSelectedTimeSlots}
                pricePerHour={venue.pricePerHour}
                workingHours={venue.workingHours}
              />
            )}

            {/* Participants */}
            {selectedTimeSlots.length > 0 && (
              <ParticipantsList participants={participants} onParticipantsChange={setParticipants} />
            )}

            {/* Payment Options */}
            {participants.length > 0 && (
              <PaymentOptions
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                totalPrice={totalPrice}
              />
            )}

            {/* Warnings */}
            {selectedTimeSlots.length > 0 && !areContiguous && (
              <div className="text-xs sm:text-sm text-warning">Los horarios deben ser consecutivos.</div>
            )}
            {hasConflict && (
              <div className="text-xs sm:text-sm text-destructive">Algún bloque está ocupado. Elige otro horario.</div>
            )}

            {/* Confirm Reservation Button */}
            {totalPrice > 0 && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">Resumen de la reserva</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })} • {selectedTimeSlots.length}{' '}
                        hora{selectedTimeSlots.length !== 1 ? 's' : ''} • {participants.length} participante
                        {participants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-primary">${totalPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleReservation}
                    disabled={!canReserve}
                    className="w-full bg-gradient-primary hover:opacity-90 h-12 sm:h-auto text-base sm:text-lg"
                    size="lg"
                    aria-disabled={!canReserve}
                  >
                    {isSubmitting ? 'Procesando…' : 'Confirmar Reserva'}
                  </Button>

                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground mt-2 text-center mobile-text-sm">
                      Serás redirigido para iniciar sesión
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;
