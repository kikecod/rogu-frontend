import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { useVenueStore } from '../../store/venueStore';

interface SportCardProps {
  sport: string;
  icon: React.ReactNode;
  name: string;
  totalVenues: number;
  color: string;
  isAuthenticated?: boolean;
}

export const SportCard: React.FC<SportCardProps> = ({
  sport,
  icon,
  name,
  totalVenues,
  color,
  isAuthenticated = false
}) => {
  const navigate = useNavigate();
  const { setSelectedSport } = useVenueStore();

  const handleClick = () => {
    if (isAuthenticated) {
      setSelectedSport(sport as any);
      navigate('/venues');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-[1.02] group"
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 text-center sm:text-left">
          <div 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalVenues} cancha{totalVenues === 1 ? '' : 's'}
            </p>
            {!isAuthenticated && (
              <p className="text-xs text-accent mt-1 font-medium">
                Inicia sesión para acceder
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};