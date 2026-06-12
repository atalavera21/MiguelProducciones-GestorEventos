# Frontend — Subagente especializado
## Gestor de Eventos · Miguel Producciones

Eres el subagente de frontend. Recibes tareas del orquestador (CLAUDE.md raíz).
Opera exclusivamente dentro de `frontend/`. No tomas decisiones de negocio —
las reglas de negocio están en el orquestador.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 14.2.35 | Framework (App Router únicamente) |
| React | 18 | UI |
| TypeScript | 5 | Lenguaje (strict) |
| Tailwind CSS | 3.4.1 | Estilos |
| ESLint | 8 | Linting |

---

## Convenciones

- **App Router únicamente** — no usar Pages Router; toda la lógica de rutas vive en `app/`
- **TypeScript estricto** — sin `any`, tipado explícito en props y retornos
- **Componentes en `components/`** — separados en `ui/` (genéricos) y `shared/` (del negocio)
- **Comunicación con backend** — siempre vía `lib/api/client.ts` usando `apiClient`; nunca
  llamadas `fetch` directas en páginas o componentes
- **No lógica de negocio en componentes** — los componentes renderizan; la lógica va en hooks
- **Base URL del backend** — siempre desde `NEXT_PUBLIC_API_URL` (ver variables de entorno)

---

## Estructura actual del frontend

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx           ← FUNCIONAL — formulario alias + password
│   ├── (dashboard)/
│   │   ├── agenda/page.tsx        ← placeholder
│   │   ├── analisis/page.tsx      ← placeholder
│   │   ├── clientes/page.tsx      ← placeholder
│   │   ├── contratos/page.tsx     ← placeholder
│   │   ├── proformas/page.tsx     ← placeholder
│   │   └── layout.tsx             ← FUNCIONAL — Sidebar fijo + main
│   ├── layout.tsx                 ← root layout con fuentes Geist + AuthProvider
│   ├── page.tsx                   ← raíz (redirige a /agenda o /login vía middleware)
│   └── globals.css                ← importa src/styles/tokens.css
├── components/
│   ├── auth/
│   │   └── RolGuard.tsx           ← FUNCIONAL — wrapper para ocultar bloques por rol
│   └── layout/
│       └── Sidebar.tsx            ← FUNCIONAL — navegación + usuario activo + logout
├── context/
│   └── AuthContext.tsx            ← FUNCIONAL — login, logout, restauración, puedeEditar
├── hooks/
│   └── useAuth.ts                 ← re-export de useAuth desde el contexto
├── lib/
│   ├── api/
│   │   └── client.ts              ← cliente HTTP base — FUNCIONAL
│   └── utils/
│       └── format.ts              ← helpers de formato
├── src/
│   └── styles/
│       └── tokens.css             ← tokens de diseño (paleta dorada + dark mode)
├── middleware.ts                  ← protección de rutas — FUNCIONAL
└── types/
    └── index.ts                   ← tipos del dominio — alineado con backend
```

---

## Lo que está funcional (no tocar sin razón)

### `lib/api/client.ts`
Cliente HTTP base. Lee `NEXT_PUBLIC_API_URL` como base URL, agrega automáticamente
el JWT del `localStorage` en el header `Authorization: Bearer`, y deserializa `res.data`.

```ts
// Uso:
import { apiClient } from '@/lib/api/client';
const clientes = await apiClient.get<Cliente[]>('/clientes');
const nuevo = await apiClient.post<Cliente>('/clientes', body);
```

### `middleware.ts`
Protección de rutas completa. Sin token → redirige a `/login`.
Con token en `/login` → redirige a `/agenda`.
Excluye assets estáticos y favicon.

### `context/AuthContext.tsx`
Estado global de autenticación. Expone:
- `usuario` — perfil del usuario activo (o `null`)
- `isLoading` — estado de carga al restaurar sesión
- `isAuthenticated` — booleano derivado
- `puedeEditar` — `true` si rol es `ADMIN` o `DUENO`
- `login(alias, password)` — autentica, guarda token (localStorage + cookie) y redirige a `/agenda`
- `logout()` — limpia token y redirige a `/login`

Al montar, llama a `GET /api/auth/me` con el token de localStorage para restaurar la sesión. Si el token está expirado, lo limpia.

### `components/auth/RolGuard.tsx`
Wrapper que muestra/oculta children según roles permitidos.
```tsx
<RolGuard roles={['ADMIN', 'DUENO']}>
  <BotonEditar />
</RolGuard>
```
Adicional: hook `useEsViewer()` para checks puntuales.

### `components/layout/Sidebar.tsx`
Sidebar fijo de 240px con:
- Logo de Miguel Producciones
- Navegación a Agenda / Clientes / Proformas / Contratos / Análisis
- Pie con nombre del usuario, badge de rol y botón "Cerrar sesión"

### `app/(dashboard)/layout.tsx`
Layout que envuelve todas las rutas dashboard con el Sidebar + main scrollable.

### `app/(auth)/login/page.tsx`
Formulario funcional con campos alias + password, spinner de envío, manejo de error y redirección automática a `/agenda` si ya hay sesión activa.

### `types/index.ts`
Tipos TypeScript que espejan el dominio del backend:
`RolUsuario`, `Usuario`, `AuthState`, `RangoEdad`, `Cliente`, `TipoEvento`, `TipoServicio`,
`EstadoContrato`, `Evento`, `MetodoPago`, `Contrato`, `ServicioProforma`, `Proforma`

---

## Pantallas

| Pantalla | Ruta | Estado | Descripción |
|---|---|---|---|
| Login | `/login` | ✅ Funcional | alias + password + spinner. Botón Google OAuth pendiente |
| Agenda | `/agenda` | Placeholder | Calendario mensual con eventos, botón "Generar contrato" |
| Proformas | `/proformas` | Placeholder | Formulario de proforma + generación de PDF |
| Contratos | `/contratos` | Placeholder | Lista de contratos con estados y filtros |
| Análisis | `/analisis` | Placeholder | Métricas: conversión, ingresos, carga mensual |
| Clientes | `/clientes` | Placeholder | CRUD de clientes con soft delete |

---

## Variables de entorno

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

En producción apunta a la URL pública del servicio backend (proveedor por definir).

---

## Módulos pendientes de implementar

Auth y navegación ya están listos. Las pantallas de negocio siguen siendo placeholders.
Orden sugerido por dependencias:

1. **Clientes** — CRUD base que otros módulos necesitan (crear evento requiere cliente)
2. **Agenda** — módulo principal del negocio (incluye autocomplete de cliente con creación rápida en modal)
3. **Proformas** — independiente, puede ir en paralelo con agenda
4. **Contratos** — depende de que haya eventos con contratos generados
5. **Análisis** — depende de datos reales en la base de datos
6. **Google OAuth** — botón en /login (post-MVP)

---

## Design System

> Sistema de diseño completo (tokens, paleta, componentes base,
> tipografía, layout): ver `.claude/agents/design-agent.md` — fuente
> autoritativa. Consultar antes de implementar cualquier
> componente nuevo.
