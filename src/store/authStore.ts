import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Cliente',
    email: 'cliente@demo.com',
    role: 'client',
  },
  {
    id: '2',
    name: 'María Propietaria',
    email: 'owner@demo.com',
    role: 'owner',
  },
  {
    id: '3',
    name: 'Carlos Controlador',
    email: 'controller@demo.com',
    role: 'controller',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string, role: UserRole) => {
        // Mock authentication - in real app, this would be an API call
        const user = mockUsers.find(u => u.email === email && u.role === role);
        
        if (user) {
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Credenciales inválidas');
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        // Mock registration
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role,
        };
        
        set({ user: newUser, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);