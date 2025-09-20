import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Star, MapPin, Users, ArrowRight } from 'lucide-react';
import type { Venue } from '../../types';

interface VenueCardProps {
  venue: Venue;
}

const sportLabels = {
  soccer: 'Fútbol',
  basketball: 'Básquetbol',
  tennis: 'Tenis',
  volleyball: 'Voleibol',
};

const sportColors = {
  soccer: '#22c55e',
  basketball: '#f59e0b',
  tennis: '#ef4444',
  volleyball: '#9333ea',
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate(`/venue/${venue.id}`);
  };

  return (
    <Card className="overflow-hidden group hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 w-full">
      <div className="relative">
        <img 
          src={venue.images[0]} 
          alt={venue.name}
          className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Badge 
          className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white font-semibold px-3 py-1 text-xs sm:text-sm rounded-full shadow-lg backdrop-blur-sm"
          style={{ backgroundColor: sportColors[venue.sport] }}
        >
          {sportLabels[venue.sport]}
        </Badge>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <ArrowRight className="w-4 h-4 text-gray-700" />
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {venue.name}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm sm:text-base font-semibold text-gray-900">{venue.rating}</span>
            <span className="text-xs text-gray-500 hidden sm:inline">({venue.totalReviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium truncate">{venue.location}</span>
        </div>
        
        <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {venue.description}
        </p>
        
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs font-medium rounded-full px-2 py-1 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors">
              {amenity}
            </Badge>
          ))}
          {venue.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs font-medium rounded-full px-2 py-1 border-gray-200 text-gray-600">
              +{venue.amenities.length - 3} más
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${venue.pricePerHour.toLocaleString()}
          </span>
          <span className="text-sm sm:text-base text-gray-600 font-medium">/hora</span>
        </div>
        <Button 
          onClick={handleReserve} 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 w-full sm:w-auto px-6"
        >
          <div className="flex items-center gap-2">
            Reservar
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </CardFooter>
    </Card>
  );
};