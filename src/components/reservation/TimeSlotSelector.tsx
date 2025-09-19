import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Clock } from 'lucide-react';

interface TimeSlotSelectorProps {
  selectedSlots: string[];
  onSlotsChange: (slots: string[]) => void;
  pricePerHour: number;
  workingHours: { start: string; end: string };
  reservedSlots?: string[];
}

export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  selectedSlots,
  onSlotsChange,
  pricePerHour,
  workingHours,
  reservedSlots = []
}) => {
  // Generate time slots from working hours
  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(workingHours.start.split(':')[0]);
    const end = parseInt(workingHours.end.split(':')[0]);
    
    for (let hour = start; hour < end; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleTimeSlot = (slot: string) => {
    if (reservedSlots.includes(slot)) return; // Can't select reserved slots
    
    if (selectedSlots.includes(slot)) {
      onSlotsChange(selectedSlots.filter(s => s !== slot));
    } else {
      onSlotsChange([...selectedSlots, slot].sort());
    }
  };

  const getSlotStatus = (slot: string) => {
    if (reservedSlots.includes(slot)) return 'reserved';
    if (selectedSlots.includes(slot)) return 'selected';
    return 'available';
  };

  const getSlotButtonVariant = (status: string) => {
    switch (status) {
      case 'selected':
        return 'default';
      case 'reserved':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSlotButtonClass = (status: string) => {
    switch (status) {
      case 'selected':
        return 'bg-primary text-primary-foreground border-primary';
      case 'reserved':
        return 'bg-muted text-muted-foreground cursor-not-allowed opacity-50';
      default:
        return 'hover:bg-primary/10 hover:border-primary';
    }
  };

  const totalHours = selectedSlots.length;
  const totalPrice = totalHours * pricePerHour;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Selecciona tus horarios</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Haz clic en los horarios que deseas reservar (mínimo 1 hora)
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Time Slots Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {timeSlots.map((slot) => {
            const status = getSlotStatus(slot);
            return (
              <Button
                key={slot}
                variant={getSlotButtonVariant(status)}
                size="sm"
                onClick={() => toggleTimeSlot(slot)}
                disabled={status === 'reserved'}
                className={`text-xs ${getSlotButtonClass(status)}`}
              >
                {slot}
              </Button>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border border-border rounded"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-muted-foreground">Seleccionado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span className="text-muted-foreground">Reservado</span>
          </div>
        </div>
        
        {/* Summary */}
        {selectedSlots.length > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-foreground">
                  {totalHours} hora{totalHours !== 1 ? 's' : ''} seleccionada{totalHours !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedSlots.join(' - ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ${totalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${pricePerHour.toLocaleString()}/hora
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};