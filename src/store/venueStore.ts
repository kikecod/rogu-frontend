import { create } from 'zustand';
import type { Venue, SportType } from '../types';

interface VenueState {
  venues: Venue[];
  filteredVenues: Venue[];
  selectedSport: SportType | null;
  selectedLocation: string;
  setFilter: (sport: SportType | null, location?: string) => void;
  setSelectedSport: (sport: SportType | null) => void;
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, venue: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
}

// Mock venues data
const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Cancha Fútbol Central',
    description: 'Cancha de fútbol 11 con césped sintético de alta calidad',
    sport: 'soccer',
    location: 'Centro',
    pricePerHour: 15000,
    images: ['/api/placeholder/400/300'],
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación LED'],
    ownerId: '2',
    rating: 4.8,
    totalReviews: 124,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' }
  },
  {
    id: '2',
    name: 'Cancha Básquet Pro',
    description: 'Cancha de básquetbol profesional con piso de madera',
    sport: 'basketball',
    location: 'Norte',
    pricePerHour: 12000,
    images: ['/api/placeholder/400/300'],
    amenities: ['Vestuarios', 'Aire acondicionado', 'Sonido'],
    ownerId: '2',
    rating: 4.6,
    totalReviews: 89,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' }
  },
  {
    id: '3',
    name: 'Cancha Tenis Club',
    description: 'Cancha de tenis con superficie de arcilla',
    sport: 'tennis',
    location: 'Sur',
    pricePerHour: 8000,
    images: ['/api/placeholder/400/300'],
    amenities: ['Vestuarios', 'Cafetería', 'Alquiler de raquetas'],
    ownerId: '2',
    rating: 4.5,
    totalReviews: 67,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' }
  },
  {
    id: '4',
    name: 'Cancha Voleibol Arena',
    description: 'Cancha de voleibol con arena importada',
    sport: 'volleyball',
    location: 'Centro',
    pricePerHour: 10000,
    images: ['/api/placeholder/400/300'],
    amenities: ['Vestuarios', 'Duchas', 'Red profesional'],
    ownerId: '2',
    rating: 4.7,
    totalReviews: 43,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' }
  }
];

export const useVenueStore = create<VenueState>()((set, get) => ({
  venues: mockVenues,
  filteredVenues: mockVenues,
  selectedSport: null,
  selectedLocation: '',

  setFilter: (sport: SportType | null, location: string = '') => {
    const { venues } = get();
    let filtered = venues;

    if (sport) {
      filtered = filtered.filter(venue => venue.sport === sport);
    }

    if (location) {
      filtered = filtered.filter(venue => 
        venue.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    set({ 
      filteredVenues: filtered, 
      selectedSport: sport, 
      selectedLocation: location 
    });
  },

  setSelectedSport: (sport: SportType | null) => {
    const { venues } = get();
    let filtered = venues;

    if (sport) {
      filtered = filtered.filter(venue => venue.sport === sport);
    }

    set({ 
      filteredVenues: filtered, 
      selectedSport: sport, 
      selectedLocation: '' 
    });
  },

  addVenue: (venueData) => {
    const newVenue: Venue = {
      id: Date.now().toString(),
      ...venueData,
    };
    
    set(state => ({
      venues: [...state.venues, newVenue],
      filteredVenues: [...state.filteredVenues, newVenue],
    }));
  },

  updateVenue: (id: string, venueData: Partial<Venue>) => {
    set(state => ({
      venues: state.venues.map(venue => 
        venue.id === id ? { ...venue, ...venueData } : venue
      ),
      filteredVenues: state.filteredVenues.map(venue => 
        venue.id === id ? { ...venue, ...venueData } : venue
      ),
    }));
  },

  deleteVenue: (id: string) => {
    set(state => ({
      venues: state.venues.filter(venue => venue.id !== id),
      filteredVenues: state.filteredVenues.filter(venue => venue.id !== id),
    }));
  },
}));