// src/store/authStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { loginUsuario } from "../lib/utils";
import type { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, userId?: string) => Promise<void>;

  getRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
}

/* ---------------- Mock API demo ---------------- */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const mockUsers: User[] = [
  { id: "1", name: "Juan Cliente", email: "cliente@demo.com", role: "client" },
  { id: "2", name: "María Propietaria", email: "owner@demo.com", role: "owner" },
  { id: "3", name: "Carlos Controlador", email: "controller@demo.com", role: "controller" },
];
async function mockAuthenticate(email: string, password: string, role: UserRole): Promise<User> {
  await delay(300);
  if (!password?.trim()) throw new Error("La contraseña es requerida.");
  const u = mockUsers.find((x) => x.email === email && x.role === role);
  if (!u) throw new Error("Credenciales inválidas.");
  return u;
}

/* ---------------- Persist config ---------------- */
const STORAGE_KEY = "auth-storage";
const STORAGE_VERSION = 1;

// Declaramos primero la variable para poder referirla en onRehydrateStorage
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        hydrated: false,

        async login(email: string, password: string) {
          // Login real con backend
          try {
            const userData = await loginUsuario(email, password);
            // Determinar el rol basado en los datos del usuario o establecer un rol por defecto
            const userRole: UserRole = 'client'; // Por defecto, o se puede determinar desde el backend
            
            const user: User = {
              id: userData.usuario?.idUsuario?.toString() || Date.now().toString(),
              name: userData.usuario?.persona?.nombres ? 
                `${userData.usuario.persona.nombres} ${userData.usuario.persona.paterno} ${userData.usuario.persona.materno}` : 
                userData.usuario?.correo || email,
              email: userData.usuario?.correo || email,
              role: userRole,
            };
            
            // Guardar el token si es necesario
            if (userData.token) {
              localStorage.setItem('auth-token', userData.token);
            }
            
            set({ user, isAuthenticated: true });
          } catch (error) {
            // Fallback al mock para desarrollo
            console.warn('Backend login failed, using mock authentication:', error);
            const user = await mockAuthenticate(email, password, 'client');
            set({ user, isAuthenticated: true });
          }
        },

        logout() {
          set({ user: null, isAuthenticated: false });
        },

        async register(name, email, _password, role, userId) {
          // Para el registro, simplemente creamos el usuario y lo autenticamos
          // Ya que el registro real se hace en el componente
          const user: User = { 
            id: userId || Date.now().toString(), 
            name, 
            email, 
            role 
          };
          set({ user, isAuthenticated: true });
        },

        getRole: () => get().user?.role ?? null,
        hasRole: (role) => get().user?.role === role,
      }),
      {
        name: STORAGE_KEY,
        version: STORAGE_VERSION,

        // Guarda sólo lo necesario. Tipado simple para evitar conflictos con d.ts
        partialize: (state) =>
          ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          }) as unknown as AuthState, // TS no se queja si devolvemos subset con cast

        // Migraciones (usa 'any' local para no pelear con la firma de persist)
        migrate: (persisted: any, version) => {
          if (version < 1) {
            return {
              user: persisted?.user ?? null,
              isAuthenticated: !!persisted?.isAuthenticated,
            };
          }
          return persisted;
        },

        // Al terminar de rehidratar marcamos hydrated=true
        onRehydrateStorage: () => {
          return () => {
            // en este punto el store ya existe
            useAuthStore.setState({ hydrated: true });
          };
        },
      }
    )
  )
);

/* --------- Selectores útiles --------- */
export const useAuthUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAuthHydrated = () => useAuthStore((s) => s.hydrated);
export const useAuthRole = () => useAuthStore((s) => s.getRole());
export const useHasRole = (role: UserRole) => useAuthStore((s) => s.hasRole(role));
