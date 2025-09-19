import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { SportType } from '../../types';
import { useVenueStore } from '../../store/venueStore';

interface SportCardProps {
  sport: SportType;
  icon: string;
  name: string;
  totalVenues: number;
  color: string;
}

export const SportCard: React.FC<SportCardProps> = ({ sport, icon, name, totalVenues, color }) => {
  const navigate = useNavigate();
  const setFilter = useVenueStore(state => state.setFilter);

  const handleClick = () => {
    setFilter(sport);
    navigate('/venues');
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-sports hover:scale-105 bg-gradient-to-br from-card to-card/90 border-2 hover:border-primary/20"
      onClick={handleClick}
    >
      <CardContent className="p-6 text-center">
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl shadow-lg"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2 text-foreground">{name}</h3>
        <Badge variant="secondary" className="text-xs">
          {totalVenues} canchas disponibles
        </Badge>
      </CardContent>
    </Card>
  );
};