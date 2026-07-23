# IMES Manager Pro

Plataforma de productividad para **registrar, organizar y analizar manualmente**
la información que observas en servicios web.

## Principio rector

La aplicación trabaja **exclusivamente** con información que el usuario ya ve en
pantalla y decide registrar manualmente. **No** accede a datos privados, **no**
automatiza acciones, **no** modifica páginas, **no** envía formularios, **no** hace
clics automáticos y **no** elude autenticación. Todo análisis se realiza sobre
registros creados por el propio usuario y toda conclusión se etiqueta en la interfaz
como una **inferencia basada únicamente en los registros almacenados**.

## Stack

- **React 19** + **Vite** + **TypeScript** (estricto)
- **TailwindCSS** con tokens de tema (claro/oscuro)
- **Firebase** Auth + Firestore
- **React Router** · **React Query (TanStack)**
- **Recharts** · **Framer Motion** · **Material Symbols**
- Extensión de navegador en **Manifest V3**

## Requisitos

- Node.js 18.18+ (recomendado 20+)
- Un proyecto de Firebase con Authentication (correo/contraseña) y Firestore.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # rellena tus credenciales de Firebase
npm run dev
```

Compilación de producción:

```bash
npm run build
npm run preview
```

## Scripts

| Script              | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo (Vite).               |
| `npm run build`     | Verificación de tipos + build de producción. |
| `npm run typecheck` | `tsc --noEmit`.                              |
| `npm run lint`      | ESLint.                                       |
| `npm run format`    | Prettier.                                     |

## Estructura

```
src/
├── assets/       Recursos estáticos (logo, íconos)
├── components/   Componentes reutilizables (ui, charts, dominios)
├── contexts/     AuthContext, ThemeContext, SettingsContext
├── firebase/     Inicialización y converters de Firestore
├── hooks/        Hooks de datos (React Query) y utilidades
├── layouts/      Layouts de aplicación y autenticación
├── pages/        Páginas enrutadas
├── services/     Acceso a Firestore por colección
├── types/        Tipos de dominio
└── utils/        Utilidades (fechas, formato, estadística, export)
```

La extensión de navegador vive en `chrome-extension/` (fase 9).

## Construcción por fases

Este proyecto se construye en 10 fases documentadas en [`PLAN.md`](./PLAN.md).
