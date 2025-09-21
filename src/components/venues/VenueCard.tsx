import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import type { Venue } from '../../types';

interface VenueCardProps {
  venue: Venue;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const sportLabels = {
  soccer: 'Fútbol',
  basketball: 'Básquetbol',
  tennis: 'Tenis',
  volleyball: 'Voleibol',
} as const;

const sportColors: Record<Venue['sport'], string> = {
  soccer: '#22c55e',
  basketball: '#f59e0b',
  tennis: '#ef4444',
  volleyball: '#9333ea',
};

export const VenueCard: React.FC<VenueCardProps> = ({ venue, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const handleReserve = () => navigate(`/venue/${venue.id}`);

  return (
    <Card
      className="
        group relative w-full overflow-hidden rounded-2xl
        bg-[#171922] ring-1 ring-white/10 shadow-lg
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        focus-within:ring-2 focus-within:ring-indigo-500/70
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={venue.images?.[0]}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b0d12] via-[#0b0d12]/40 to-transparent" />

        {/* Sport pill */}
        <Badge
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-sm sm:left-4 sm:top-4 sm:text-sm"
          style={{ backgroundColor: sportColors[venue.sport] }}
        >
          {sportLabels[venue.sport]}
        </Badge>

        {/* Favorite */}
        <button
          type="button"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(venue.id);
          }}
          className="
            absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur
            transition hover:bg-black/70 sm:right-4 sm:top-4
          "
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
        </button>

        {/* Hint arrow */}
        <div
          className="
            absolute right-3 bottom-3 rounded-full bg-white/90 p-2 text-gray-700 opacity-0
            transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100
            sm:right-4 sm:bottom-4
          "
        >
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* CONTENT */}
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-semibold leading-snug text-white sm:text-xl">
            {venue.name}
          </h3>
          <div className="flex flex-shrink-0 items-center gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-amber-400" />
            <span className="text-sm font-semibold text-amber-400">{venue.rating.toFixed(1)}</span>
            <span className="hidden text-xs text-zinc-400 sm:inline">({venue.totalReviews})</span>
          </div>
        </div>

        <div className="mb-3 flex items-center text-zinc-400">
          <MapPin className="mr-2 h-4 w-4 flex-shrink-0 text-zinc-500" />
          <span className="truncate text-sm sm:text-base">{venue.location}</span>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-300/90 sm:text-[0.95rem]">
          {venue.description}
        </p>

        {/* Amenities (compact) */}
        <div className="mb-1 flex flex-wrap gap-2">
          {venue.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-300"
            >
              {a}
            </span>
          ))}
          {venue.amenities.length > 3 && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
              +{venue.amenities.length - 3}
            </span>
          )}
        </div>
      </CardContent>

      {/* FOOTER / PRICE + CTA */}
      <CardFooter
        className="
          mt-auto flex flex-col items-center justify-between gap-3 border-t border-white/10
          p-4 sm:flex-row sm:gap-4 sm:p-5
        "
      >
        <div className="text-center sm:text-left">
          <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
            ${venue.pricePerHour.toLocaleString()}
          </span>
          <span className="ml-1 text-sm font-medium text-zinc-400">/hora</span>
        </div>

        <Button
          onClick={handleReserve}
          className="
            w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500
            px-6 py-2 font-semibold text-white shadow-lg
            transition-all duration-200 hover:from-indigo-600 hover:to-fuchsia-600 hover:shadow-xl hover:brightness-[1.02]
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-[#171922]
            sm:w-auto
          "
        >
          <span className="flex items-center gap-2">
            Reservar
            <ArrowRight className="h-4 w-4" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
