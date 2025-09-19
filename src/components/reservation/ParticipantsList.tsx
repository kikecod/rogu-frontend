import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Plus, X } from 'lucide-react';
import type { Participant } from '../../types';

interface ParticipantsListProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
  maxParticipants?: number;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onParticipantsChange,
  maxParticipants = 20
}) => {
  const [newParticipant, setNewParticipant] = useState<Participant>({
    name: '',
    phone: ''
  });

  const addParticipant = () => {
    if (!newParticipant.name.trim()) return;
    
    const participant: Participant = {
      name: newParticipant.name.trim(),
      phone: newParticipant.phone?.trim() || undefined, // <- safe
    };
    
    onParticipantsChange([...participants, participant]);
    setNewParticipant({ name: '', phone: '' });
  };

  const removeParticipant = (index: number) => {
    onParticipantsChange(participants.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  const canAddMore = participants.length < maxParticipants;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <span>Participantes ({participants.length})</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Agrega los nombres de las personas que asistirán
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Add Participant Form */}
        {canAddMore && (
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="participant-name">Nombre *</Label>
                <Input
                  id="participant-name"
                  placeholder="Nombre completo"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="participant-phone">Teléfono (opcional)</Label>
                <Input
                  id="participant-phone"
                  placeholder="Número de teléfono"
                  value={newParticipant.phone}
                  onChange={(e) => setNewParticipant({ ...newParticipant, phone: e.target.value })}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            <Button 
              onClick={addParticipant}
              disabled={!newParticipant.name.trim()}
              size="sm"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Participante
            </Button>
          </div>
        )}

        {/* Participants List */}
        {participants.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-medium text-foreground mb-3">
              Lista de participantes:
            </h4>
            {participants.map((participant, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">{participant.name}</p>
                  {participant.phone && (
                    <p className="text-sm text-muted-foreground">{participant.phone}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No hay participantes agregados</p>
            <p className="text-sm">Agrega al menos un participante para continuar</p>
          </div>
        )}

        {!canAddMore && (
          <p className="text-sm text-warning bg-warning/10 p-3 rounded-lg">
            Se ha alcanzado el límite máximo de {maxParticipants} participantes
          </p>
        )}
      </CardContent>
    </Card>
  );
};