# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


# Instalación de dependencias (rogu-frontend)

Este documento resume cómo instalar **todas** las dependencias usadas, separadas en _prod_ y _dev_. Está pensado para un proyecto Vite + React (18/19) con Tailwind y shadcn/ui.

> **Requisitos**: Node 18+ y npm 9+.

---

## 1) Instalar dependencias de producción

```bash
npm i @tanstack/react-query react-router-dom zustand lucide-react date-fns@^3 clsx tailwind-merge qrcode.react @radix-ui/react-accordion @radix-ui/react-alert-dialog class-variance-authority @radix-ui/react-aspect-ratio @radix-ui/react-avatar react-day-picker@^9 embla-carousel-react recharts @radix-ui/react-checkbox cmdk @radix-ui/react-context-menu vaul @radix-ui/react-dropdown-menu @radix-ui/react-label react-hook-form @radix-ui/react-hover-card input-otp @radix-ui/react-popover @radix-ui/react-navigation-menu @radix-ui/react-menubar @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-dialog @radix-ui/react-tooltip @radix-ui/react-switch @radix-ui/react-slider @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-toast @radix-ui/react-tabs react-resizable-panels next-themes sonner
```

> **Notas**  
> - Usa `date-fns@^3` (no instales `@types/date-fns`, ya no se usan).  
> - `react-day-picker@^9` es compatible con React 19; si usas React 18 también funciona.

---

## 2) Instalar dependencias de desarrollo

```bash
npm i -D @types/react-router-dom @types/qrcode.react tailwindcss-animate
```

---

## 3) Consejos y solución de conflictos

- Si ves el error **“Expected 1–2 arguments, but got 3”** al usar `format` de `date-fns`, es porque hay tipos viejos en el proyecto. Asegúrate de **no** tener `@types/date-fns` instalado.
- Si aparece **ERESOLVE** por _peer deps_:
  - Revisa que `date-fns` sea `^3`.
  - Evita mezclar `react-day-picker@8` con `react@19`. Usa `react-day-picker@^9`.
  - Como último recurso (no recomendado), instala con `--legacy-peer-deps`.

---

## 4) Ejemplo de uso de `date-fns` en español

```ts
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const fecha = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });
console.log(fecha);
```

---

## 5) Scripts útiles (opcional)

Si usas Vite, añade en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```
