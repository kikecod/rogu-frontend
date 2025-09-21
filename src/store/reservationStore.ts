// src/store/reservationStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Reservation } from '../types';
import { parseISO, isAfter, isBefore, startOfDay, compareAsc, compareDesc } from 'date-fns';

/* ======================================
   Helpers
   ====================================== */

type ResStatus = Reservation['status']; // 'pending' | 'confirmed' | 'cancelled' | 'completed'

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const makeQr = (r: { venueId: string; clientId: string; date: string }) =>
  `QR_${r.venueId}_${r.clientId}_${r.date}_${Date.now()}`;

function isToday(d: Date) {
  const today = startOfDay(new Date());
  return +startOfDay(d) === +today;
}

/** Validación ligera de datos de reserva */
function validateReservation(input: Omit<Reservation, 'id' | 'createdAt' | 'qrCode' | 'status'> & { status?: ResStatus }) {
  const errors: string[] = [];

  const d = parseISO(input.date);
  if (Number.isNaN(+d)) errors.push('Fecha inválida');
  if (!Number.isNaN(+d) && !isAfter(d, startOfDay(new Date())) && !isToday(d)) {
    errors.push('La fecha debe ser futura (o hoy)');
  }

  if (!Array.isArray(input.timeSlots) || input.timeSlots.length === 0) {
    errors.push('Debes seleccionar al menos un horario');
  }

  if (input.totalHours !== input.timeSlots.length) {
    errors.push('totalHours no coincide con la cantidad de horarios');
  }

  if (!Array.isArray(input.participants) || input.participants.length === 0) {
    errors.push('Agrega al menos un participante');
  }

  if (typeof input.totalPrice !== 'number' || input.totalPrice <= 0) {
    errors.push('El precio total debe ser mayor a 0');
  }

  return { ok: errors.length === 0, errors };
}

/* ======================================
   Estado & API
   ====================================== */

export interface ReservationState {
  reservations: Reservation[];

  // writes
  addReservation: (
    reservation: Omit<Reservation, 'id' | 'createdAt' | 'qrCode' | 'status'> & { status?: ResStatus }
  ) => { ok: true; reservation: Reservation } | { ok: false; errors: string[] };

  updateReservation: (id: string, patch: Partial<Reservation>) => Reservation | null;
  cancelReservation: (id: string) => Reservation | null;

  // reads
  getUserReservations: (userId: string) => Reservation[];
  getVenueReservations: (venueId: string) => Reservation[];
  getUpcomingByUser: (userId: string) => Reservation[];
  getPastByUser: (userId: string) => Reservation[];
  getPendingByUser: (userId: string) => Reservation[];
  getCancelledByUser: (userId: string) => Reservation[];

  validateQRCode: (qrCode: string) => { valid: boolean; reservation: Reservation | null; reason?: string };
}

/* Seed opcional (ajusta fechas si quieres que aparezca como “próxima”) */
const mockReservations: Reservation[] = [
  {
    id: '1',
    venueId: '1',
    clientId: '1',
    date: '2025-12-20',
    timeSlots: ['09:00', '10:00'],
    totalHours: 2,
    totalPrice: 30000,
    status: 'confirmed',
    participants: [
      { name: 'Juan Cliente', phone: '123456789' },
      { name: 'Pedro Amigo', phone: '987654321' },
    ],
    qrCode: 'QR_001_2025',
    paymentMethod: 'traditional',
    createdAt: '2025-09-01T10:00:00Z',
  },
];

export const useReservationStore = create<ReservationState>()(
  devtools(
    persist(
      (set, get) => ({
        reservations: mockReservations,

        addReservation: (data) => {
          const base = { ...data, status: (data.status ?? 'confirmed') as ResStatus };
          const { ok, errors } = validateReservation(base);
          if (!ok) return { ok: false, errors };

          const newReservation: Reservation = {
            id: uid(),
            qrCode: makeQr({ venueId: base.venueId, clientId: base.clientId, date: base.date }),
            createdAt: new Date().toISOString(),
            ...base,
          };

          set((state) => ({ reservations: [...state.reservations, newReservation] }), false, 'reservations/add');
          return { ok: true, reservation: newReservation };
        },

        updateReservation: (id, patch) => {
          let updated: Reservation | null = null;
          set(
            (state) => ({
              reservations: state.reservations.map((r) => {
                if (r.id !== id) return r;
                updated = { ...r, ...patch };
                return updated!;
              }),
            }),
            false,
            'reservations/update'
          );
          return updated;
        },

        cancelReservation: (id) => {
          let cancelled: Reservation | null = null;
          set(
            (state) => ({
              reservations: state.reservations.map((r) => {
                if (r.id !== id) return r;
                cancelled = { ...r, status: 'cancelled' };
                return cancelled!;
              }),
            }),
            false,
            'reservations/cancel'
          );
          return cancelled;
        },

        // Selectores
        getUserReservations: (userId) => {
          const list = get().reservations.filter((r) => r.clientId === userId);
          return list.sort((a, b) => {
            // confirmadas primero, luego fecha desc
            if (a.status === 'confirmed' && b.status !== 'confirmed') return -1;
            if (a.status !== 'confirmed' && b.status === 'confirmed') return 1;
            return compareDesc(parseISO(a.date), parseISO(b.date));
          });
        },

        getVenueReservations: (venueId) => {
          const list = get().reservations.filter((r) => r.venueId === venueId);
          return list.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
        },

        getUpcomingByUser: (userId) => {
          const today = startOfDay(new Date());
          return get()
            .reservations
            .filter((r) => r.clientId === userId && r.status === 'confirmed' && isAfter(parseISO(r.date), today))
            .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
        },

        getPastByUser: (userId) => {
          const today = startOfDay(new Date());
          return get()
            .reservations
            .filter((r) => r.clientId === userId && (r.status === 'completed' || isBefore(parseISO(r.date), today)))
            .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
        },

        getPendingByUser: (userId) =>
          get()
            .reservations
            .filter((r) => r.clientId === userId && r.status === 'pending')
            .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date))),

        getCancelledByUser: (userId) =>
          get()
            .reservations
            .filter((r) => r.clientId === userId && r.status === 'cancelled')
            .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date))),

        validateQRCode: (qrCode) => {
          const r = get().reservations.find((x) => x.qrCode === qrCode);
          if (!r) return { valid: false, reservation: null, reason: 'QR no encontrado' };
          if (r.status !== 'confirmed') return { valid: false, reservation: r, reason: `Estado: ${r.status}` };
          const d = parseISO(r.date);
          if (isBefore(d, startOfDay(new Date()))) {
            return { valid: false, reservation: r, reason: 'Reserva expirada' };
          }
          return { valid: true, reservation: r };
        },
      }),
      {
        name: 'reservation-storage',
        version: 2,
        partialize: (state) => ({ reservations: state.reservations }),
        migrate: (persisted, version) => {
          if (!persisted) return persisted as any;
          if (version < 2) {
            const fixed = {
              ...persisted,
              reservations: (persisted as any).reservations?.map((r: any) => ({
                // primero el objeto original…
                ...r,
                // …y luego sobreescribimos si faltaban
                createdAt: r.createdAt ?? new Date().toISOString(),
                qrCode: r.qrCode ?? makeQr({ venueId: r.venueId, clientId: r.clientId, date: r.date }),
              })),
            };
            return fixed as any;
          }
          return persisted as any;
        },
      }
    )
  )
);
