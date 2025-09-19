import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import type { Reservation } from '../../types';

interface QRCodeDisplayProps {
  reservation: Reservation;
  venueName: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ reservation, venueName }) => {
  const qrData = JSON.stringify({
    reservationId: reservation.id,
    venueId: reservation.venueId,
    code: reservation.qrCode,
    date: reservation.date,
    participants: reservation.participants.length,
  });

  return (
    <Card className="w-full max-w-md mx-auto border-border shadow-card-custom">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold text-foreground">
          Código QR - Acceso
        </CardTitle>
        <Badge className="mx-auto bg-success text-white">
          Reserva Confirmada
        </Badge>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg inline-block">
          <QRCodeSVG 
            value={qrData}
            size={200}
            level="M"
            includeMargin={true}
          />
        </div>
        
        {/* Reservation Details */}
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{venueName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {new Date(reservation.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {reservation.timeSlots.join(' - ')} ({reservation.totalHours}h)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              {reservation.participants.length} participante{reservation.participants.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-muted p-3 rounded-lg text-left">
          <h4 className="font-medium text-sm text-foreground mb-2">
            Instrucciones de uso:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Presenta este código QR al controlador</li>
            <li>• El acceso es válido solo para los participantes registrados</li>
            <li>• Llega 10 minutos antes del horario reservado</li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Código: {reservation.qrCode}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};