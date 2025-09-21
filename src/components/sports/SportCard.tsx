import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { useVenueStore } from '../../store/venueStore';
import type { SportType } from '../../types';

export type SportCardProps = {
  sport: SportType;
  icon: React.ReactNode;
  name: string;
  totalVenues: number;
  color: string;
  isAuthenticated?: boolean;
  /** Si lo pasas, reemplaza la navegación por defecto */
  onClick?: () => void;
  /** Para lectores de pantalla */
  ariaLabel?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const SportCard = React.memo(
  React.forwardRef<HTMLDivElement, SportCardProps>(function SportCard(
    {
      sport,
      icon,
      name,
      totalVenues,
      color,
      isAuthenticated = false,
      onClick,
      ariaLabel,
      className,
      ...rest
    },
    ref
  ) {
    const navigate = useNavigate();
    const { setSelectedSport } = useVenueStore();

    // Acción por defecto si no pasan onClick
    const defaultClick = React.useCallback(() => {
      if (isAuthenticated) {
        setSelectedSport(sport);
        navigate('/venues');
      } else {
        navigate('/auth/login');
      }
    }, [isAuthenticated, navigate, setSelectedSport, sport]);

    const handleClick = onClick ?? defaultClick;

    // Soporte teclado (Enter/Espacio)
    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const interactiveProps = {
      role: 'button' as const,
      tabIndex: 0,
      onKeyDown,
      'aria-label': ariaLabel ?? `Ver canchas de ${name}`,
    };

    return (
      <Card
        ref={ref}
        {...rest}
        {...interactiveProps}
        onClick={handleClick}
        data-auth={isAuthenticated ? 'yes' : 'no'}
        className={[
          'cursor-pointer border-0 shadow-md hover:shadow-lg transition-all duration-300',
          'hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-primary/50 focus-visible:ring-offset-2 rounded-2xl',
          className ?? '',
        ].join(' ')}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-3 sm:space-y-0 text-center sm:text-left">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl transition-transform duration-300"
              style={{ backgroundColor: color }}
              aria-hidden
            >
              {icon}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg text-foreground transition-colors duration-300 group-hover:text-primary">
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
  })
);
