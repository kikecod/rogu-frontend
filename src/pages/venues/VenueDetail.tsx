import React, { useState } from 'react';
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
  Coffee
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import type { Participant } from '../../types';

const sportLabels = {
  soccer: 'Fútbol',
  basketball: 'Básquetbol', 
  tennis: 'Tenis',
  volleyball: 'Voleibol',
};

const sportColors = {
  soccer: 'hsl(var(--sports-soccer))',
  basketball: 'hsl(var(--sports-basketball))',
  tennis: 'hsl(var(--sports-tennis))',
  volleyball: 'hsl(var(--sports-volleyball))',
};

const amenityIcons: { [key: string]: React.ReactNode } = {
  'Vestuarios': <Users className="w-4 h-4" />,
  'Estacionamiento': <Car className="w-4 h-4" />,
  'Wifi': <Wifi className="w-4 h-4" />,
  'Cafetería': <Coffee className="w-4 h-4" />,
};

const VenueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { venues } = useVenueStore();
  const { addReservation } = useReservationStore();
  const { user, isAuthenticated } = useAuthStore();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Find the venue
  const venue = venues.find(v => v.id === id);

  // Reservation state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'traditional' | 'qr'>('traditional');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleReservation = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión requerida",
        description: "Debes iniciar sesión para hacer una reserva",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    if (!selectedDate || selectedTimeSlots.length === 0 || participants.length === 0) {
      toast({
        title: "Datos incompletos",
        description: "Por favor completa todos los campos: fecha, horarios y participantes",
        variant: "destructive",
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
        title: "¡Reserva confirmada!",
        description: `Tu reserva para ${venue.name} ha sido confirmada exitosamente`,
      });

      // Redirect to user reservations
      navigate('/dashboard/client/reservations');

    } catch (error) {
      toast({
        title: "Error en la reserva",
        description: "No se pudo procesar tu reserva. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const totalPrice = selectedTimeSlots.length * venue.pricePerHour;
  const canReserve = selectedDate && selectedTimeSlots.length > 0 && participants.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mobile-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
          <Button variant="ghost" onClick={() => navigate('/venues')}>
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
                <img 
                  src={venue.images[0]} 
                  alt={venue.name}
                  className="w-full h-48 sm:h-64 object-cover"
                />
                <Badge 
                  className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white font-medium text-xs sm:text-sm"
                  style={{ backgroundColor: sportColors[venue.sport] }}
                >
                  {sportLabels[venue.sport]}
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

                <p className="text-muted-foreground text-sm sm:text-base">{venue.description}</p>

                <div>
                  <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Servicios disponibles:</h4>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {venue.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1 text-xs">
                        {amenityIcons[amenity] || <CheckCircle className="w-4 h-4" />}
                        <span>{amenity}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">Precio por hora:</h4>
                  <p className="text-xl sm:text-2xl font-bold text-primary">
                    ${venue.pricePerHour.toLocaleString()}
                  </p>
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
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
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
                        "w-full justify-start text-left font-normal h-10 sm:h-auto text-sm sm:text-base",
                        !selectedDate && "text-muted-foreground"
                      )}
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
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
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
              <ParticipantsList
                participants={participants}
                onParticipantsChange={setParticipants}
              />
            )}

            {/* Payment Options */}
            {participants.length > 0 && (
              <PaymentOptions
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                totalPrice={totalPrice}
              />
            )}

            {/* Confirm Reservation Button */}
            {totalPrice > 0 && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        Resumen de la reserva
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })} • {selectedTimeSlots.length} hora{selectedTimeSlots.length !== 1 ? 's' : ''} • {participants.length} participante{participants.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        ${totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={handleReservation}
                    disabled={!canReserve || isSubmitting}
                    className="w-full bg-gradient-primary hover:opacity-90 h-12 sm:h-auto text-base sm:text-lg"
                    size="lg"
                  >
                    {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
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