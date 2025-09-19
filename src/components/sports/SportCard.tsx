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
}

export const SportCard: React.FC<SportCardProps> = ({
  sport,
  icon,
  name,
  totalVenues,
  color
}) => {
  const navigate = useNavigate();
  const { setSelectedSport } = useVenueStore();

  const handleClick = () => {
    setSelectedSport(sport);
    navigate('/venues');
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-0 shadow-md"
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div 
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">
              {totalVenues} {totalVenues === 1 ? 'venue' : 'venues'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};