import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { CreditCard, QrCode, Shield, Clock } from 'lucide-react';

interface PaymentOptionsProps {
  selectedMethod: 'traditional' | 'qr';
  onMethodChange: (method: 'traditional' | 'qr') => void;
  totalPrice: number;
}

export const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  selectedMethod,
  onMethodChange,
  totalPrice
}) => {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span>Método de Pago</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Selecciona cómo deseas pagar tu reserva
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <RadioGroup 
          value={selectedMethod} 
          onValueChange={(value) => onMethodChange(value as 'traditional' | 'qr')}
        >
          {/* Traditional Payment */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="traditional" id="traditional" />
            <Label htmlFor="traditional" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Pago Tradicional</h4>
                    <p className="text-sm text-muted-foreground">
                      Tarjeta de crédito, débito o transferencia
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Seguro</span>
                </div>
              </div>
            </Label>
          </div>

          {/* QR Payment */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="qr" id="qr" />
            <Label htmlFor="qr" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Pago por QR</h4>
                    <p className="text-sm text-muted-foreground">
                      Escanea y paga con tu app móvil
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Rápido</span>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Payment Summary */}
        <div className="bg-gradient-primary p-4 rounded-lg text-primary-foreground">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Total a pagar</h4>
              <p className="text-sm opacity-90">
                {selectedMethod === 'traditional' ? 'Pago seguro garantizado' : 'Pago instantáneo por QR'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                ${totalPrice.toLocaleString()}
              </p>
              <p className="text-xs opacity-75">
                Incluye todos los cargos
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-muted p-3 rounded-lg">
          <h5 className="font-medium text-sm text-foreground mb-2">
            {selectedMethod === 'traditional' ? '💳 Pago Tradicional' : '📱 Pago por QR'}
          </h5>
          <p className="text-xs text-muted-foreground">
            {selectedMethod === 'traditional' 
              ? 'Al confirmar serás redirigido a la plataforma de pagos segura. Aceptamos todas las tarjetas principales.'
              : 'Después de confirmar, recibirás un código QR para pagar con tu aplicación bancaria favorita.'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};