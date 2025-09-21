// store/venue.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Venue, SportType } from '../types';



/* =========================
   Helpers
   ========================= */

// ID estable para usar como seed de imágenes
const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

type SortKey = 'relevance' | 'price_asc' | 'price_desc' | 'rating_desc' | 'rating_asc';

/** ============== Image Provider ==============
 * Proveedores posibles (usa el 1 por defecto):
 *  1) LoremFlickr (temático, sin API key): https://loremflickr.com/400/300/soccer
 *  2) Unsplash Source (sin key; puede rate-limitar): https://source.unsplash.com/featured/400x300?query
 *  3) Picsum (estable por seed, sin temática): https://picsum.photos/seed/{seed}/400/300
 */
const IMG_W = 400;
const IMG_H = 300;

const sportQuery: Record<SportType, string> = {
  soccer: 'soccer,football,stadium,grass',
  basketball: 'basketball,court,hoop,indoor',
  tennis: 'tennis,clay,grass,hardcourt,racket',
  volleyball: 'volleyball,beach,indoor,net',
};

function getImageForVenue(sport: SportType, seed: string, w = IMG_W, h = IMG_H): string {
  const q = sportQuery[sport] ?? 'sports';
  // Opción 1 (recomendada por temática y disponibilidad)
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(q)}?lock=${encodeURIComponent(seed)}`;

  // Otras opciones:
  // return `https://source.unsplash.com/featured/${w}x${h}/?${encodeURIComponent(q)}`;
  // return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

/** Comprueba rápidamente que una URL de imagen carga. Si falla, genera un fallback. */
async function validateOrSwapImage(url: string, sport: SportType, seed: string) {
  const ok = await new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

  if (ok) return url;
  // Fallback remoto temático
  return getImageForVenue(sport, `${seed}_1`);
}

/* =========================
   Filters
   ========================= */

interface VenueFilters {
  sport: SportType | null;
  location: string;
  query: string;
  amenities: string[];
  minRating?: number;
  priceRange?: [number, number];
  sortBy: SortKey;
}

const defaultFilters: VenueFilters = {
  sport: null,
  location: '',
  query: '',
  amenities: [],
  minRating: undefined,
  priceRange: undefined,
  sortBy: 'relevance',
};

function applyFilters(venues: Venue[], f: VenueFilters): Venue[] {
  let list = venues.filter((v) => v.isActive);

  if (f.sport) list = list.filter((v) => v.sport === f.sport);

  if (f.location) {
    const loc = norm(f.location);
    list = list.filter((v) => norm(v.location).includes(loc));
  }

  if (f.query) {
    const q = norm(f.query);
    list = list.filter(
      (v) => norm(v.name).includes(q) || norm(v.description).includes(q) || norm(v.location).includes(q),
    );
  }

  if (f.amenities.length) {
    const need = f.amenities.map(norm);
    list = list.filter((v) => {
      const have = v.amenities.map(norm);
      return need.every((a) => have.includes(a));
    });
  }

  if (typeof f.minRating === 'number') {
    list = list.filter((v) => v.rating >= (f.minRating ?? 0));
  }

  if (f.priceRange) {
    const [min, max] = f.priceRange;
    list = list.filter((v) => v.pricePerHour >= min && v.pricePerHour <= max);
  }

  switch (f.sortBy) {
    case 'price_asc':
      list.sort((a, b) => a.pricePerHour - b.pricePerHour);
      break;
    case 'price_desc':
      list.sort((a, b) => b.pricePerHour - a.pricePerHour);
      break;
    case 'rating_desc':
      list.sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);
      break;
    case 'rating_asc':
      list.sort((a, b) => a.rating - b.rating || a.totalReviews - b.totalReviews);
      break;
    case 'relevance':
    default:
      list.sort((a, b) => {
        const ar = a.rating * Math.log10(Math.max(1, a.totalReviews));
        const br = b.rating * Math.log10(Math.max(1, b.totalReviews));
        return br - ar || a.pricePerHour - b.pricePerHour;
      });
  }

  return list;
}

/* =========================
   Mock Data
   ========================= */
// Nota: al importar la imagen con Vite (futbolImgUrl) obtienes la URL final ya resuelta.
// Para las que dejes vacías ([]), las rellenamos automáticamente en initImages/ensureVenueImages.

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Cancha Fútbol Central',
    description: 'Cancha de fútbol 11 con césped sintético de alta calidad',
    sport: 'soccer',
    location: 'Centro',
    pricePerHour: 15000,
    images: [], // ← imagen local ya resuelta por el bundler
    amenities: ['Vestuarios', 'Estacionamiento', 'Iluminación LED'],
    ownerId: '2',
    rating: 4.8,
    totalReviews: 124,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' },
  },
  {
    id: '2',
    name: 'Cancha Básquet Pro',
    description: 'Cancha de básquetbol profesional con piso de madera',
    sport: 'basketball',
    location: 'Norte',
    pricePerHour: 12000,
    images: [], // ← se completará automáticamente
    amenities: ['Vestuarios', 'Aire acondicionado', 'Sonido'],
    ownerId: '2',
    rating: 4.6,
    totalReviews: 89,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' },
  },
  {
    id: '3',
    name: 'Cancha Tenis Club',
    description: 'Cancha de tenis con superficie de arcilla',
    sport: 'tennis',
    location: 'Sur',
    pricePerHour: 8000,
    images: [], // ← se completará automáticamente
    amenities: ['Vestuarios', 'Cafetería', 'Alquiler de raquetas'],
    ownerId: '2',
    rating: 4.5,
    totalReviews: 67,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' },
  },
  {
    id: '4',
    name: 'Cancha Voleibol Arenas',
    description: 'Cancha de voleibol con arena importada',
    sport: 'volleyball',
    location: 'Centro',
    pricePerHour: 10000,
    images: [], // ← se completará automáticamente
    amenities: ['Vestuarios', 'Duchas', 'Red profesional'],
    ownerId: '2',
    rating: 4.7,
    totalReviews: 43,
    isActive: true,
    workingHours: { start: '08:00', end: '22:00' },
  },
];

/* =========================
   Store
   ========================= */

interface VenueState {
  venues: Venue[];
  filteredVenues: Venue[];
  favorites: string[];
  filters: VenueFilters;

  // filtros/orden
  setFilters: (patch: Partial<VenueFilters>) => void;
  resetFilters: () => void;
  setFilter: (sport: SportType | null, location?: string) => void;
  setSelectedSport: (sport: SportType | null) => void;

  // CRUD
  addVenue: (venue: Omit<Venue, 'id'>) => Promise<Venue>;
  addManyVenues: (venues: Omit<Venue, 'id'>[]) => Promise<void>;
  updateVenue: (id: string, patch: Partial<Venue>) => Venue | null;
  deleteVenue: (id: string) => void;

  // imágenes
  initImages: () => Promise<void>;

  // favoritos
  toggleFavorite: (id: string) => void;

  // selectores
  getVenueById: (id: string) => Venue | undefined;
  getTopRated: (limit?: number) => Venue[];
  getActiveBySport: (sport: SportType) => Venue[];
}

export const useVenueStore = create<VenueState>()(
  devtools(
    persist(
      (set, get) => ({
        venues: mockVenues,
        filteredVenues: applyFilters(mockVenues, defaultFilters),
        favorites: [],
        filters: { ...defaultFilters },

        /* =========================
           Imágenes
           ========================= */
        initImages: async () => {
          const venues = await ensureVenueImages(get().venues);
          const filteredVenues = applyFilters(venues, get().filters);
          set({ venues, filteredVenues }, false, 'venues/initImages');
        },

        // filtros
        setFilters: (patch) => {
          const filters = { ...get().filters, ...patch };
          const filteredVenues = applyFilters(get().venues, filters);
          set({ filters, filteredVenues }, false, 'venues/setFilters');
        },

        resetFilters: () => {
          const filters = { ...defaultFilters };
          const filteredVenues = applyFilters(get().venues, filters);
          set({ filters, filteredVenues }, false, 'venues/resetFilters');
        },

        setFilter: (sport, location = '') => {
          get().setFilters({ sport, location });
        },

        setSelectedSport: (sport) => {
          get().setFilters({ sport, location: '' });
        },

        // CRUD con hidratación de imágenes
        addVenue: async (venueData) => {
          const id = uid();
          const images =
            venueData.images && venueData.images.length
              ? venueData.images
              : [await validateOrSwapImage(getImageForVenue(venueData.sport, id), venueData.sport, id)];

          const newVenue: Venue = { id, ...venueData, images };
          const venues = [...get().venues, newVenue];
          const filteredVenues = applyFilters(venues, get().filters);
          set({ venues, filteredVenues }, false, 'venues/add');
          return newVenue;
        },

        addManyVenues: async (incoming) => {
          const withIds: Venue[] = [];
          for (const v of incoming) {
            const id = uid();
            const images =
              v.images && v.images.length
                ? v.images
                : [await validateOrSwapImage(getImageForVenue(v.sport, id), v.sport, id)];
            withIds.push({ id, ...v, images });
          }
          const venues = [...get().venues, ...withIds];
          const filteredVenues = applyFilters(venues, get().filters);
          set({ venues, filteredVenues }, false, 'venues/addMany');
        },

        updateVenue: (id, patch) => {
          let changed: Venue | null = null;
          const venues = get().venues.map((v) => {
            if (v.id !== id) return v;
            changed = { ...v, ...patch };
            return changed;
          });
          const filteredVenues = applyFilters(venues, get().filters);
          set({ venues, filteredVenues }, false, 'venues/update');
          return changed;
        },

        deleteVenue: (id) => {
          const venues = get().venues.filter((v) => v.id !== id);
          const filteredVenues = applyFilters(venues, get().filters);
          const favorites = get().favorites.filter((fid) => fid !== id);
          set({ venues, filteredVenues, favorites }, false, 'venues/delete');
        },

        toggleFavorite: (id) => {
          const favs = new Set(get().favorites);
          favs.has(id) ? favs.delete(id) : favs.add(id);
          set({ favorites: [...favs] }, false, 'venues/toggleFavorite');
        },

        getVenueById: (id) => get().venues.find((v) => v.id === id),
        getTopRated: (limit = 6) =>
          [...get().venues]
            .filter((v) => v.isActive)
            .sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews)
            .slice(0, limit),

        getActiveBySport: (sport) => get().venues.filter((v) => v.isActive && v.sport === sport),
      }),
      {
        name: 'venue-storage',
        version: 1,
        partialize: (s) => ({
          venues: s.venues,
          favorites: s.favorites,
          filters: s.filters,
        }),
      },
    ),
  ),
);

/* =========================
   Image hydration utilities
   ========================= */

/**
 * Si la imagen ya viene importada (como `futbolImgUrl`), ese string ya es una URL válida
 * (Vite/webpack la resuelve). Si viene vacía, generamos una temática por deporte.
 * Luego verificamos que la URL cargue; si falla, usamos un fallback.
 */
async function ensureVenueImages(venues: Venue[]): Promise<Venue[]> {
  const updated = await Promise.all(
    venues.map(async (v) => {
      const idSeed = v.id || uid();
      const candidate = v.images?.[0] || getImageForVenue(v.sport, idSeed);
      const okUrl = await validateOrSwapImage(candidate, v.sport, idSeed);
      return { ...v, images: [okUrl] };
    }),
  );
  return updated;
}
