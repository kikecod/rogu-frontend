import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { VenueCard } from '../../components/venues/VenueCard';
import { useVenueStore } from '../../store/venueStore';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import type { SportType } from '../../types';

const sportLabels = {
  soccer: 'Fútbol',
  basketball: 'Básquetbol',
  tennis: 'Tenis',
  volleyball: 'Voleibol',
};

const VenueList = () => {
  const [searchParams] = useSearchParams();
  const { filteredVenues, setFilter, selectedSport, selectedLocation } = useVenueStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [localLocation, setLocalLocation] = useState('');
  const [localSport, setLocalSport] = useState<SportType | 'all'>('all');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Apply filters from URL params
    const sportParam = searchParams.get('sport') as SportType;
    const locationParam = searchParams.get('location') || '';
    
    if (sportParam) {
      setLocalSport(sportParam);
      setFilter(sportParam, locationParam);
    } else {
      setLocalSport('all');
    }
    
    if (locationParam) {
      setLocalLocation(locationParam);
    }
  }, [searchParams, setFilter]);

  const handleSearch = () => {
    setFilter(localSport === 'all' ? null : localSport, localLocation);
  };

  const clearFilters = () => {
    setLocalSport('all');
    setLocalLocation('');
    setFilter(null, '');
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mobile-padding">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 mobile-text-center">
            Canchas Deportivas Disponibles
          </h1>
          <p className="text-muted-foreground mobile-text-center">
            Encuentra la cancha perfecta para tu próximo partido
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 shadow-card-custom">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Filtros</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mobile-grid-1 mobile-gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Deporte</label>
              <Select value={localSport} onValueChange={(value) => setLocalSport(value as SportType | 'all')}>
                <SelectTrigger className="h-10 sm:h-auto">
                  <SelectValue placeholder="Todos los deportes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los deportes</SelectItem>
                  <SelectItem value="soccer">⚽ Fútbol</SelectItem>
                  <SelectItem value="basketball">🏀 Básquetbol</SelectItem>
                  <SelectItem value="tennis">🎾 Tenis</SelectItem>
                  <SelectItem value="volleyball">🏐 Voleibol</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-foreground">Ubicación</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ubicación"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                  className="pl-10 h-10 sm:h-auto text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-end gap-2 sm:col-span-2 lg:col-span-1">
              <Button onClick={handleSearch} className="bg-gradient-primary hover:opacity-90 mobile-full-width">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={clearFilters} className="mobile-full-width">
                Limpiar
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedSport || selectedLocation) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {selectedSport && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  {sportLabels[selectedSport]}
                </span>
              )}
              {selectedLocation && (
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  📍 {selectedLocation}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mobile-text-center">
            {filteredVenues.length} cancha{filteredVenues.length !== 1 ? 's' : ''} encontrada{filteredVenues.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Venue Grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mobile-grid-1 mobile-gap-4">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              No se encontraron canchas
            </h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <Button onClick={clearFilters} variant="outline">
              Ver todas las canchas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueList;