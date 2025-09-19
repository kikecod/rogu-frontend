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
      className="cursor-pointer card-modern group overflow-hidden"
      onClick={handleClick}
    >
      <CardContent className="p-8 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {totalVenues} canchas
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
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