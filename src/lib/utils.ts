// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// 1) cn: clsx + tailwind-merge (con opción de extender reglas si lo necesitas)
const twMergeExtended = extendTailwindMerge({
  // Aquí puedes añadir grupos personalizados si usas clases propias
  // (p.ej. tokens como bg-gradient-primary, o variantes "glass", etc.)
  // override: {
  //   classGroups: {
  //     'bg-gradient': [{ pattern: /^bg-gradient-/ }],
  //   },
  // },
});
export function cn(...inputs: ClassValue[]) {
  return twMergeExtended(clsx(inputs));
}

// 2) Atajo: cx (solo clsx) si no quieres merge semántico de Tailwind
export const cx = (...inputs: ClassValue[]) => clsx(inputs);

// 3) dataAttr/ariaAttr: helpers para atributos booleanos
export const dataAttr = (cond?: boolean) => (cond ? '' : undefined);
export const ariaAttr = (cond?: boolean) => (cond ? true : undefined);

// 4) mergeRefs: útil en componentes con forwardRef + refs internas
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(value);
      else (ref as React.MutableRefObject<T | null>).current = value;
    }
  };
}

// 5) sleep/debounce: helpers pequeños para UX
export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function debounce<T extends (...args: any[]) => void>(fn: T, delay = 250) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// 6) API helpers for backend communication
export const API_BASE_URL = 'http://localhost:3000/api';

export interface PersonaData {
  nombres: string;
  paterno: string;
  materno: string;
  documentoTipo: string;
  documentoNumero: string;
  telefono: string;
  fechaNacimiento: string;
  genero: string;
}

export interface UsuarioData {
  idPersona: number;
  correo: string;
  contrasena: string;
  correoVerificado: boolean;
}

export async function createPersona(data: PersonaData) {
  const response = await fetch(`${API_BASE_URL}/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al crear la persona');
  }

  return response.json();
}

export async function registerUsuario(data: UsuarioData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al registrar el usuario');
  }

  return response.json();
}

export async function loginUsuario(correo: string, contrasena: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error('Credenciales inválidas');
  }

  return response.json();
}

// 7) clamp: límites numéricos (animaciones, sliders)
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// 7) formateadores comunes (moneda / fecha)
export function formatCurrency(
  amount: number,
  locale: string = 'es-AR',
  currency: string = 'ARS'
) {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString(locale)} ${currency}`;
  }
}

export function formatISODate(iso: string, locale: string = 'es-ES', opts?: Intl.DateTimeFormatOptions) {
  const d = new Date(iso);
  if (Number.isNaN(+d)) return iso;
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', ...opts }).format(d);
}

// 8) utilidades varias
export const isBrowser = () => typeof window !== 'undefined';

export function invariant(condition: any, message = 'Invariant violation') {
  if (!condition) throw new Error(message);
}

// Ejemplo de slugify para ids/paths
export function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}
