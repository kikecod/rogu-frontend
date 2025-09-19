export type UserRole = 'client' | 'owner' | 'controller';

export type SportType = 'soccer' | 'basketball' | 'tennis' | 'volleyball';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  sport: SportType;
  location: string;
  pricePerHour: number;
  images: string[];
  amenities: string[];
  ownerId: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  workingHours: {
    start: string; // "08:00"
    end: string;   // "22:00"
  };
}

export interface Reservation {
  id: string;
  venueId: string;
  clientId: string;
  date: string; // YYYY-MM-DD
  timeSlots: string[]; // ["09:00", "10:00", "11:00"]
  totalHours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  participants: Participant[];
  qrCode: string;
  paymentMethod: 'traditional' | 'qr';
  createdAt: string;
}

export interface Participant {
  name: string;
  phone?: string;
}

export interface QRCode {
  id: string;
  reservationId: string;
  code: string;
  isValid: boolean;
  maxParticipants: number;
  scannedAt?: string;
  controllerName?: string;
}

export interface SportStats {
  sport: SportType;
  totalVenues: number;
  icon: string;
  color: string;
}