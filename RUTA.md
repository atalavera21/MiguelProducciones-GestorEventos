# Ruta de desarrollo — Gestor de Eventos
### Miguel Producciones · Lima, Perú

> **Protocolo de sesión:**
> 1. Leer este archivo completo antes de responder cualquier cosa
> 2. Al cerrar sesión: actualizar "Última sesión", "Estado general" y "Próximo paso"
> 3. Si se toma una decisión técnica relevante, agregarla a "Decisiones técnicas"

---

## Objetivo del sistema

Sistema privado de gestión para una productora audiovisual de 5–6 personas.
Reemplaza WhatsApp + documentos sueltos con un flujo trazable:
**consulta → proforma (PDF) → evento → contrato (PDF firmado) → entrega → terminado**

Usuarios: `adrian` (ADMIN), `miguel` (DUENO), `demo` (VIEWER). Sin registro público.
Moneda: Soles peruanos (S/). Ciudad: Lima, Perú.

---

## Estado general — 2026-04-29

### Backend

| Módulo | Archivos | Estado |
|---|---|---|
| Clean Architecture (domain / application / infrastructure / presentation) | Toda la carpeta `src/` | ✅ Implementado |
| Schema Prisma completo | `prisma/schema.prisma` | ✅ Implementado |
| Entidades de dominio | `src/domain/entities/*.ts` (13 archivos) | ✅ Implementado |
| Interfaces de repositorio | `src/domain/repositories/*.ts` (12 archivos) | ✅ Implementado |
| Repositorios Prisma | `src/infrastructure/repositories/*.ts` (12 archivos) | ✅ Implementado |
| Use cases — Auth | `LoginUseCase`, `GetMeUseCase`, `RefreshTokenUseCase` | ✅ Implementado |
| Use cases — Cliente | `Create`, `GetAll`, `GetById`, `Update`, `Delete` (soft) | ✅ Implementado |
| Use cases — Evento | `Create`, `GetAll`, `GetById`, `Update`, `Delete` (soft) | ✅ Implementado |
| Use cases — Contrato | `Generar`, `GetAll`, `GetById`, `ActualizarEstado`, `Cancelar` | ✅ Implementado |
| Use cases — Proforma | `Create`, `GetById`, `Delete` (hard) | ✅ Implementado |
| Controllers | Auth / Catálogo / Cliente / Contrato / Evento / Proforma | ✅ Implementado |
| Rutas REST + protección por método | `/api/auth`, `/api/clientes`, `/api/eventos`, `/api/contratos`, `/api/proformas`, `/api/catalogos` | ✅ Implementado |
| Schemas Zod (validación de DTOs) | `presentation/schemas/*.ts` (5 archivos) | ✅ Implementado |
| Middlewares | `auth.middleware`, `roles.middleware`, `error.middleware` | ✅ Implementado |
| Seed | 3 usuarios + catálogos (tipos_evento, tipos_servicio, estados_contrato) | ✅ Implementado |
| Base de datos activa | PostgreSQL nativo en la PC del desarrollador | ⚠️ Pendiente (migración + seed no ejecutados aún) |
| Generación de PDF | `@react-pdf/renderer` — proformas y contratos | ❌ No iniciado |
| Supabase Storage | Subir PDF del contrato y guardar URL | ❌ No iniciado |
| Endpoints de análisis | `/api/analisis/*` | ❌ No iniciado |
| Google OAuth | Login alternativo con Google | ❌ No iniciado |

### Frontend

| Módulo | Archivos | Estado |
|---|---|---|
| App Router + estructura de rutas | `app/(auth)/login`, `app/(dashboard)/*` | ✅ Implementado |
| Design system (tokens CSS + Tailwind) | `src/styles/tokens.css`, `tailwind.config.ts` | ✅ Implementado |
| Sistema de responsividad | `SidebarContext`, `Sidebar`, `TopBar`, `DashboardShell`, `layout` | ✅ Implementado |
| Cliente HTTP base | `lib/api/client.ts` — JWT automático, base URL configurable | ✅ Implementado |
| Tipos TypeScript del dominio | `types/index.ts` — espeja todos los modelos del backend | ✅ Implementado |
| Middleware de protección de rutas | `middleware.ts` — sin token → `/login`, con token en login → `/agenda` | ✅ Implementado |
| AuthContext | Login, logout, restauración de sesión, `puedeEditar` por rol | ✅ Implementado |
| UI Login | Formulario alias + password, spinner, manejo de error | ✅ Implementado |
| RolGuard + useEsViewer | Ocultar/mostrar bloques según rol | ✅ Implementado |
| Sidebar responsive | Drawer móvil (`< lg`) + colapso a íconos en desktop (`≥ lg`) | ✅ Implementado |
| TopBar | Barra superior con hamburguesa — solo en `< lg` | ✅ Implementado |
| UI Clientes | Listado, búsqueda, modal crear/editar, archivar | ❌ No iniciado |
| UI Agenda | Calendario mensual, crear evento, botón "Generar contrato" | ❌ No iniciado |
| UI Proformas | Formulario libre, generación PDF al vuelo | ❌ No iniciado |
| UI Contratos | Listado con estados, detalle, cambio de estado | ❌ No iniciado |
| UI Análisis | Métricas de conversión, ingresos, carga mensual | ❌ No iniciado |

---

## Última sesión — 2026-04-29 (sesión 2)

### Refinamiento módulo Agenda — Formulario nuevo evento

**Backend — schema y capas:**
- `prisma/schema.prisma` — eliminado enum `TipoPapel`; añadidos a `Evento`: `horaFin DateTime?`, `fechaEntrega DateTime? @db.Date`, `montoAdelanto Decimal?`, `montoTotal Decimal?`; `DetalleFotografia`: reemplazado `tipoPapel TipoPapel?` por `cantidad Int?` y `tamano String? @db.VarChar(50)`; `DetalleCuadroFirma`: añadido `nombre String @db.VarChar(150)`, `descripcion` ahora opcional
- `src/domain/entities/Evento.ts` — nuevos campos en `Evento`, `DetallesFilmacionDto` (`incluyeHighlight` → `incluyeReelCorto`), `DetallesCuadroFirmaDto` → `DetallesAdicionalDto` con `nombre`
- `src/domain/entities/DetalleFotografia.ts` — eliminado `TipoPapel`, añadidos `cantidad?` y `tamano?`
- `src/domain/entities/DetalleCuadroFirma.ts` — añadido `nombre`, `descripcion` ahora opcional
- `src/domain/entities/Contrato.ts` — `CrearContratoDto.montoAdelanto` ahora opcional
- `src/presentation/schemas/evento.schema.ts` — Zod actualizado con todos los cambios
- `src/infrastructure/repositories/PrismaEventoRepository.ts` — refleja nuevos campos en create/update/toDomain
- `src/application/use-cases/contrato/GenerarContrato.ts` — usa `evento.montoTotal` si definido, `evento.montoAdelanto` como default del adelanto
- `prisma/seed.ts` — "Cuadro Firma" renombrado a "Adicional"

**Frontend:**
- `frontend/types/index.ts` — eliminado `TipoPapel`; `Evento` y `EventoResumen` con nuevos campos; `CrearServicioPayload` y `CrearEventoPayload` actualizados
- `frontend/app/(dashboard)/agenda/nuevo/page.tsx` — rediseño completo:
  - Cabecera: botón "← Volver a Agenda" con flecha SVG animada, título grande, subtítulo
  - Horario: campo `horaInicio` (requerido) + `horaFin` (opcional)
  - Fecha de entrega: date picker que auto-calcula fecha evento +10 días
  - Fotografía física: reemplaza tipo papel por cantidad + tamaño
  - Filmación: "highlight" → "reel corto"
  - Adicionales dinámicos: botón "+ Agregar servicio adicional" → cards con nombre (libre), descripción opcional, precio; se pueden eliminar individualmente
  - Sección Montos: total calculado automáticamente (suma servicios, editable), adelanto, saldo calculado en tiempo real
  - Botón "Restaurar suma" si el total fue editado manualmente

### Sistema de responsividad (frontend — sesión 1)

Implementado sistema completo mobile-first. Breakpoint clave: `lg` (1024px).

**Archivos creados/modificados:**
- `frontend/src/styles/tokens.css` — agregadas variables `--sidebar-width: 240px` y `--sidebar-collapsed-width: 64px`
- `frontend/app/globals.css` — limpiado; body usa tokens del design system en vez de defaults Next.js
- `frontend/context/SidebarContext.tsx` — nuevo; estado `isOpen` (drawer móvil) e `isCollapsed` (desktop)
- `frontend/components/layout/Sidebar.tsx` — refactor completo con íconos SVG inline sin librería externa
- `frontend/components/layout/TopBar.tsx` — nuevo; barra superior con hamburguesa, solo `< lg`
- `frontend/components/layout/DashboardShell.tsx` — nuevo; wrapper cliente que aplica `lg:ml-60` o `lg:ml-16`
- `frontend/app/(dashboard)/layout.tsx` — refactorizado; conecta `SidebarProvider → Sidebar + DashboardShell(TopBar + main)`
- `CLAUDE.md` — instrucción de leer `RUTA.md` al inicio de sesión
- `RUTA.md` — este archivo, creado

### Archivo de ruta
- Creado `RUTA.md` en la raíz del proyecto como log de desarrollo
- Instrucción de lectura obligatoria agregada al tope de `CLAUDE.md`

---

## Próximo paso

**Siguiente tarea:** UI de Clientes — `/clientes`

Es el primer módulo de negocio y el más simple. Los demás módulos dependen de él
(crear un evento requiere seleccionar un cliente existente).

### Qué construir
1. **Listado de clientes** — tabla con nombre, teléfono, DNI, rango de edad, referencia. Filtro activo/archivado. Búsqueda por nombre.
2. **Modal crear cliente** — campos: nombre, teléfono, DNI, sexo, rangoEdad, referencia (opcional). Validación en frontend.
3. **Modal editar cliente** — mismos campos, pre-cargados.
4. **Archivar cliente** — botón que hace `DELETE /api/clientes/:id` (soft delete). Confirmar antes de ejecutar.
5. **RolGuard** en botones de crear/editar/archivar — solo `ADMIN` y `DUENO`.

### Endpoint que consume
```
GET    /api/clientes          → listado (público)
POST   /api/clientes          → crear (ADMIN/DUENO)
PATCH  /api/clientes/:id      → editar (ADMIN/DUENO)
DELETE /api/clientes/:id      → archivar (ADMIN/DUENO)
```

### Tipo de datos disponible
```ts
// types/index.ts — ya definido
export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  dni: string;
  referencia?: string;
  sexo: boolean;       // true = masculino, false = femenino
  rangoEdad: RangoEdad; // '18-30' | '30-45' | '45+'
  activo: boolean;
}
```

---

## Backlog completo (por prioridad)

### Frontend — pantallas de negocio
- [ ] **UI Clientes** — CRUD + soft delete + RolGuard ← siguiente
- [ ] **UI Agenda** — calendario mensual + ver evento + botón "Generar contrato"
- [ ] **UI Agenda** — formulario crear evento (con servicios: foto, filmación, cuadro firma)
- [ ] **UI Proformas** — formulario libre + botón generar PDF (descarga al vuelo)
- [ ] **UI Contratos** — listado + filtro por estado + detalle + cambio de estado
- [ ] **UI Análisis** — métricas: tipos más contratados, ingresos, carga mensual
- [ ] **Botón Google OAuth** — en `/login` (post-MVP)

### Backend — módulos pendientes
- [ ] **Levantar BD local** — `psql CREATE DATABASE`, `prisma migrate dev --name init`, `prisma db seed`
- [ ] **Generación PDF proformas** — `@react-pdf/renderer`, endpoint `GET /api/proformas/:id/pdf`
- [ ] **Generación PDF contratos** — template React PDF + subida a Supabase Storage + `pdfUrl` en contrato
- [ ] **Endpoints de análisis** — `GET /api/analisis/*` (ingresos, conversión, carga mensual)
- [ ] **Google OAuth** — `passport-google-oauth20` o implementación manual con `googleapis`

### Infraestructura (post entregable 1)
- [ ] **Elegir proveedor de hosting** — Railway fue eliminado por inactividad; pendiente decidir
- [ ] **Variables de entorno en producción** — `DATABASE_URL`, `JWT_SECRET`, `SUPABASE_*`, `GOOGLE_*`
- [ ] **CI/CD básico** — deploy automático en push a `main`

---

## Arquitectura actual (referencia rápida)

```
[Navegador]
    ↓ HTTPS
[Next.js 14 — App Router]   puerto 3000
    ↓ HTTP / apiClient (JWT automático)
[Express 5 — API REST]       puerto 3001
    ↓ Prisma 7 + @prisma/adapter-pg
[PostgreSQL 15]
    ↓ (pendiente)
[Supabase Storage — PDFs contratos]
```

### Breakpoints responsive del frontend
| Rango | Comportamiento |
|---|---|
| `< 1024px` (móvil/tablet) | Sidebar oculto, TopBar con hamburguesa, drawer deslizable con backdrop |
| `≥ 1024px` (desktop) | TopBar oculto, sidebar fijo — colapsa a 64px (íconos) o 240px (etiquetas) |

### Protección de rutas (backend)
| Método | Autenticación | Roles |
|---|---|---|
| GET | Pública | Cualquiera |
| POST / PATCH / DELETE | JWT obligatorio | ADMIN, DUENO |
| POST `/api/auth/login` | Pública | — |

### Soft delete vs hard delete
| Entidad | Estrategia |
|---|---|
| Cliente | `activo = false` |
| Evento | `activo = false` |
| Contrato | Transición a estado `Cancelado` (id=4) |
| Proforma | `DELETE` físico — es desechable |

### Estados del contrato
```
1 = Pendiente          (recién generado)
2 = PendienteEntrega   (evento ocurrió, producto en preparación)
3 = Terminado          (entrega confirmada)
4 = Cancelado          (anulado — equivale a soft delete del contrato)

Flujo válido:  Pendiente → PendienteEntrega → Terminado
               Pendiente → Cancelado
               PendienteEntrega → Cancelado
```

---

## Decisiones técnicas tomadas

### Arquitectura y modelo de datos
- **Clean Architecture en backend** — domain → application → infrastructure → presentation. El domain no importa nada externo. Solo Prisma en infrastructure.
- **Desnormalización en contratos** — `nombreCliente`, `dniCliente`, `tipoEvento`, `direccionEvento`, `fechaHoraEvento` se copian al generar el contrato. El PDF debe reflejar el acuerdo exactamente como fue firmado, ignorando ediciones futuras.
- **JSONB en proformas.servicios** — la proforma es un documento libre; el schema no debe restringir qué servicios combinar.
- **Tablas de catálogo (no enums)** para `tipos_evento`, `tipos_servicio`, `estados_contrato` — administrables sin cambiar código.
- **Proforma sin relaciones** — entidad completamente aislada. No apunta a clientes ni eventos porque el prospecto puede no ser un cliente registrado aún.
- **Un solo contrato por evento** — restricción de negocio, forzada por `@unique` en `Contrato.idEvento`.

### Base de datos y migraciones
- **Greenfield hasta entregable 1** — una sola migración baseline `init`. Si cambia el schema: borrar `prisma/migrations/` y regenerar. Sin datos productivos, no tiene sentido acumular migraciones.
- **Prisma client generado en `src/generated/prisma/`** — no en `node_modules/`. Configurado en `prisma.config.ts` con `generator client { output = "../src/generated/prisma" }`.
- **Driver adapter `@prisma/adapter-pg`** — requerido por la versión de Prisma 7.

### Autenticación
- **JWT almacenado en `localStorage` + cookie** — `localStorage` para el cliente HTTP (`apiClient`); cookie para el middleware de Next.js que no puede leer `localStorage` (corre en el servidor). La cookie tiene `SameSite=Strict` y expira en 8h.
- **Sin registro público** — los usuarios se crean únicamente por seed. Tres usuarios: `adrian` (ADMIN), `miguel` (DUENO), `demo` (VIEWER).
- **`VIEWER` accede vía GET públicos** — los GETs no requieren token. Esto simplifica la auth: viewer equivale a "acceso de solo lectura sin token".

### Frontend — design system
- **Paleta oscura con dorado** — `bg-base: #0F0F13`, `primary: #C9A84C`. Tema fijo oscuro, sin toggle claro/oscuro.
- **Tokens como CSS custom properties** — `tokens.css` define las variables; `tailwind.config.ts` las expone como clases (`bg-bg-surface`, `text-primary`, etc.). Nunca colores hardcodeados.
- **Fuente Geist** — cargada como `localFont` desde `app/fonts/`. Sin carga de Google Fonts.

### Frontend — responsividad (2026-04-29)
- **Breakpoint clave `lg` (1024px)** — por debajo: sidebar como drawer móvil; por encima: sidebar fijo colapsable.
- **Sin container queries** — el layout es predecible (siempre sidebar + contenido). Container queries son para componentes de librería que no saben en qué contexto viven.
- **Sin breakpoints custom** — los estándar de Tailwind cubren todos los casos de uso del sistema.
- **Íconos SVG inline sin librería** — tipo `(props: { className?: string }) => ReactElement`. Sin `@heroicons/react`. Los íconos son pocos y controlados.
- **`isMobile` prop en `SidebarContent`** — en el drawer móvil, `isCollapsed` se ignora y siempre se muestran las etiquetas. En desktop, `isCollapsed` determina si se muestra íconos o etiquetas.
- **Animación por CSS transform** — el drawer usa `translate-x-0 / -translate-x-full` con `transition-transform duration-300`. El backdrop usa `opacity` + `pointer-events-none/auto`. Nunca montar/desmontar el DOM para animaciones.
- **`DashboardShell`** — componente cliente que consume `SidebarContext` y aplica el margen correcto (`lg:ml-60` o `lg:ml-16`). Permite que `DashboardLayout` se mantenga como server component.

### Frontend — comunicación con el backend
- **`apiClient`** — cliente HTTP base en `lib/api/client.ts`. Lee `NEXT_PUBLIC_API_URL` como base. Inyecta JWT desde `localStorage`. Extrae `res.data` automáticamente. Lanza `Error` con `body.error` si el status no es 2xx.
- **`res.data` como envoltura** — el backend siempre devuelve `{ data: ... }`. El cliente extrae `.data` antes de retornar.
