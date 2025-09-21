import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ReservationCard } from '../../components/reservations/ReservationCard';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { useAuthStore } from '../../store/authStore';
import { useReservationStore } from '../../store/reservationStore';
import { useVenueStore } from '../../store/venueStore';
import { ArrowLeft, Plus, Calendar, Search } from 'lucide-react';
import { parseISO, isAfter, isBefore, startOfDay, compareAsc, compareDesc } from 'date-fns';
import { cn } from '../../lib/utils';


type TabKey = 'upcoming' | 'pending' | 'past' | 'cancelled';

const ClientReservations: React.FC = () => {
  const { user } = useAuthStore();
  const { getUserReservations } = useReservationStore();
  const { venues } = useVenueStore();

  const [query, setQuery] = useState('');
  const [sport, setSport] = useState<'all' | 'soccer' | 'basketball' | 'tennis' | 'volleyball'>('all');
  const [tab, setTab] = useState<TabKey>('upcoming');

  // Índice de venues para buscar nombre/sport rápido
  const venueIndex = useMemo(() => {
    const m = new Map<string, { name: string; sport?: string }>();
    venues.forEach(v => m.set(v.id, { name: v.name, sport: v.sport }));
    return m;
  }, [venues]);

  const all = getUserReservations(user?.id || '');

  // Filtro por texto/sport aplicado a todas las reservas
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(r => {
      const venue = venueIndex.get(r.venueId);
      const name = venue?.name?.toLowerCase() || '';
      const sportOk = sport === 'all' ? true : venue?.sport === sport;
      const searchOk = !q || name.includes(q);
      return sportOk && searchOk;
    });
  }, [all, query, sport, venueIndex]);

  const today = startOfDay(new Date());

  // Particiones y orden
  const upcoming = useMemo(
    () =>
      filtered
        .filter(r => r.status === 'confirmed' && isAfter(parseISO(r.date), today))
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))),
    [filtered, today]
  );

  const pending = useMemo(
    () =>
      filtered
        .filter(r => r.status === 'pending')
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))),
    [filtered]
  );

  const past = useMemo(
    () =>
      filtered
        .filter(r => r.status === 'completed' || isBefore(parseISO(r.date), today))
        .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))),
    [filtered, today]
  );

  const cancelled = useMemo(
    () =>
      filtered
        .filter(r => r.status === 'cancelled')
        .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))),
    [filtered]
  );

  const counts = {
    upcoming: upcoming.length,
    pending: pending.length,
    past: past.length,
    cancelled: cancelled.length,
  };

  const renderGrid = (items: typeof filtered) =>
    items.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {items.map(r => (
          <ReservationCard key={r.id} reservation={r} />
        ))}
      </div>
    ) : (
      <EmptyState tab={tab} />
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
          <div className="flex items-start sm:items-center gap-3">
            <Link to="/dashboard/client">
              <Button variant="ghost" size="sm" className="shrink-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mis Reservas</h1>
              <p className="text-muted-foreground">Gestiona todas tus reservas de canchas deportivas</p>
            </div>
          </div>

          <Link to="/venues">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Reserva
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre de cancha"
                className="pl-10 h-10 sm:h-11 bg-background border-border"
              />
            </div>
            <div className="md:col-span-1">
              <Select value={sport} onValueChange={(v) => setSport(v as typeof sport)}>
                <SelectTrigger className="h-10 sm:h-11 bg-background border-border">
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
            <div className="flex md:justify-end">
              <Link to="/venues" className="w-full md:w-auto">
                <Button variant="outline" className="w-full md:w-auto">Explorar canchas</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="w-full">
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              Próximas <Badge variant="secondary" className="rounded-full">{counts.upcoming}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              Pendientes <Badge variant="secondary" className="rounded-full">{counts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="past" className="flex items-center gap-2">
              Pasadas <Badge variant="secondary" className="rounded-full">{counts.past}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2">
              Canceladas <Badge variant="secondary" className="rounded-full">{counts.cancelled}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">{renderGrid(upcoming)}</TabsContent>
          <TabsContent value="pending" className="mt-6">{renderGrid(pending)}</TabsContent>
          <TabsContent value="past" className="mt-6">{renderGrid(past)}</TabsContent>
          <TabsContent value="cancelled" className="mt-6">{renderGrid(cancelled)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ tab: TabKey }> = ({ tab }) => {
  const config: Record<TabKey, { title: string; subtitle: string; tone: string }> = {
    upcoming: {
      title: 'No tienes reservas próximas',
      subtitle: '¡Es hora de planificar tu próximo partido!',
      tone: 'text-primary',
    },
    pending: {
      title: 'No tienes reservas pendientes',
      subtitle: 'Todas tus reservas están confirmadas o completadas',
      tone: 'text-warning',
    },
    past: {
      title: 'No tienes reservas pasadas',
      subtitle: 'Tus reservas completadas aparecerán aquí',
      tone: 'text-muted-foreground',
    },
    cancelled: {
      title: 'No tienes reservas canceladas',
      subtitle: '¡Perfecto! Todas tus reservas siguen activas',
      tone: 'text-destructive',
    },
  };

  const c = config[tab];

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-muted grid place-items-center mx-auto mb-4">
        <Calendar className={cn('w-8 h-8', c.tone)} />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-1">{c.title}</h3>
      <p className="text-muted-foreground mb-4">{c.subtitle}</p>
      <Link to="/venues">
        <Button className="bg-gradient-primary hover:opacity-90">Explorar Canchas</Button>
      </Link>
    </div>
  );
};

export default ClientReservations;
