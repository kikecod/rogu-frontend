import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Reservation, Participant } from '../types';

interface ReservationState {
  reservations: Reservation[];
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'qrCode'>) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  cancelReservation: (id: string) => void;
  getUserReservations: (userId: string) => Reservation[];
  getVenueReservations: (venueId: string) => Reservation[];
  validateQRCode: (qrCode: string) => Reservation | null;
}

// Mock reservations data
const mockReservations: Reservation[] = [
  {
    id: '1',
    venueId: '1',
    clientId: '1',
    date: '2024-03-20',
    timeSlots: ['09:00', '10:00'],
    totalHours: 2,
    totalPrice: 30000,
    status: 'confirmed',
    participants: [
      { name: 'Juan Cliente', phone: '123456789' },
      { name: 'Pedro Amigo', phone: '987654321' },
    ],
    qrCode: 'QR_001_2024',
    paymentMethod: 'traditional',
    createdAt: '2024-03-15T10:00:00Z',
  },
];

export const useReservationStore = create<ReservationState>()(
  persist(
    (set, get) => ({
      reservations: mockReservations,

      addReservation: (reservationData) => {
        const newReservation: Reservation = {
          id: Date.now().toString(),
          qrCode: `QR_${Date.now()}`,
          createdAt: new Date().toISOString(),
          ...reservationData,
        };
        
        set(state => ({
          reservations: [...state.reservations, newReservation],
        }));
      },

      updateReservation: (id: string, reservationData: Partial<Reservation>) => {
        set(state => ({
          reservations: state.reservations.map(reservation => 
            reservation.id === id ? { ...reservation, ...reservationData } : reservation
          ),
        }));
      },

      cancelReservation: (id: string) => {
        set(state => ({
          reservations: state.reservations.map(reservation => 
            reservation.id === id ? { ...reservation, status: 'cancelled' as const } : reservation
          ),
        }));
      },

      getUserReservations: (userId: string) => {
        const { reservations } = get();
        return reservations.filter(reservation => reservation.clientId === userId);
      },

      getVenueReservations: (venueId: string) => {
        const { reservations } = get();
        return reservations.filter(reservation => reservation.venueId === venueId);
      },

      validateQRCode: (qrCode: string) => {
        const { reservations } = get();
        const reservation = reservations.find(r => r.qrCode === qrCode && r.status === 'confirmed');
        return reservation || null;
      },
    }),
    {
      name: 'reservation-storage',
    }
  )
);