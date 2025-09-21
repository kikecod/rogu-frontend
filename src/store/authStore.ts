// src/store/authStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, UserRole } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;

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
async function mockRegister(name: string, email: string, password: string, role: UserRole): Promise<User> {
  await delay(300);
  if (!name.trim()) throw new Error("El nombre es requerido.");
  if (!email.trim()) throw new Error("El correo es requerido.");
  if (!password.trim()) throw new Error("La contraseña es requerida.");
  if (mockUsers.some((x) => x.email === email)) throw new Error("Ese correo ya existe.");
  const user: User = { id: Date.now().toString(), name, email, role };
  mockUsers.push(user);
  return user;
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

        async login(email, password, role) {
          const user = await mockAuthenticate(email, password, role);
          set({ user, isAuthenticated: true });
        },

        logout() {
          set({ user: null, isAuthenticated: false });
        },

        async register(name, email, password, role) {
          const user = await mockRegister(name, email, password, role);
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
