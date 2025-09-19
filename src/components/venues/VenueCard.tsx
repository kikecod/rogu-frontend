import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Star, MapPin, Users } from 'lucide-react';
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
  soccer: 'hsl(var(--sports-soccer))',
  basketball: 'hsl(var(--sports-basketball))',
  tennis: 'hsl(var(--sports-tennis))',
  volleyball: 'hsl(var(--sports-volleyball))',
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate(`/venue/${venue.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-custom hover:scale-[1.02] bg-card border border-border">
      <div className="relative">
        <img 
          src={venue.images[0]} 
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className="absolute top-3 left-3 text-white font-medium"
          style={{ backgroundColor: sportColors[venue.sport] }}
        >
          {sportLabels[venue.sport]}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground line-clamp-1">{venue.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium text-foreground">{venue.rating}</span>
            <span className="text-xs text-muted-foreground">({venue.totalReviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{venue.location}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {venue.description}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {venue.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{venue.amenities.length - 3} más
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-xl font-bold text-primary">
            ${venue.pricePerHour.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/hora</span>
        </div>
        <Button onClick={handleReserve} className="bg-gradient-primary hover:opacity-90">
          Reservar
        </Button>
      </CardFooter>
    </Card>
  );
};