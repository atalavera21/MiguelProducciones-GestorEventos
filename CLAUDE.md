# Gestor de Eventos — Miguel Producciones
## Orquestador

---

> **INICIO DE SESIÓN — OBLIGATORIO**
> Leer [`RUTA.md`](./RUTA.md) antes de responder cualquier cosa.
> Contiene el estado actual del proyecto, lo hecho en la última sesión y el próximo paso concreto.

---

## Reglas de comportamiento del agente

1. 🔴 CRÍTICA — Cliente y Evento se archivan con `activo=false` (nunca DELETE) y los listados muestran solo los `activo=true`; el Contrato se "elimina" pasando a `Cancelado` y solo la Proforma se borra físicamente.
2. `GET` es público; `POST`/`PATCH`/`DELETE` exigen JWT y rol `ADMIN` o `DUENO`.
3. Un contrato solo pasa a `Terminado` desde `PendienteEntrega`.
4. No existe alta pública de usuarios: solo se crean por seed.
5. 🔴 CRÍTICA — Los contratos copian los datos de cliente y evento al momento de la firma y esos campos no se re-sincronizan después.

---

## Contexto del negocio

**Miguel Producciones** es una productora audiovisual de eventos sociales en Lima, Perú.
Servicios principales: fotografía y video por horas de cobertura.
Servicios secundarios: cuadro firma, anuarios, alquiler de togas, sesiones fotográficas.
El equipo es de 5–6 personas y puede cubrir múltiples eventos simultáneamente.

**El problema que resuelve:** sin este sistema, la operación depende de WhatsApp, documentos
sueltos y memoria — contratos sin historial trazable, proformas sin formato consistente,
agenda informal y sin métricas de negocio.

**Uso privado — dos usuarios con roles distintos. Sin registro público.**
Los usuarios se crean directamente en base de datos mediante seed.

### Usuarios y roles

| Rol | Permisos |
|---|---|
| `admin` | Acceso total — crear, editar, eliminar, generar contratos |
| `dueno` | Igual que admin — operación completa del negocio |
| `viewer` | Solo lectura — puede ver agenda, clientes y contratos, sin crear ni modificar |

El rol `viewer` está pensado para miembros del equipo. El sistema de roles está diseñado
para ser extensible sin reestructurar la autenticación.

---

## Stack tecnológico

| Capa | Tecnología | Versión | Justificación de negocio |
|---|---|---|---|
| Runtime backend | Node.js | 18+ | Un solo lenguaje en backend y frontend |
| Framework backend | Express | 5 | API desacoplada — si se necesita app móvil, la misma API sirve sin cambios |
| ORM | Prisma | 7 | Driver adapter (`@prisma/adapter-pg`) + migraciones tipadas — cambios sin riesgo de pérdida de datos |
| Validación | Zod | latest | Schemas tipados y única fuente de verdad para DTOs en el backend |
| Base de datos | PostgreSQL | 15 | Relacional, open source. Desarrollo: instancia nativa en la PC del desarrollador |
| Framework frontend | Next.js | 14 | Renderizado en servidor — páginas más rápidas en conexiones móviles desde eventos |
| Generación de PDF | @react-pdf/renderer | latest | Templates como componentes React — modificar diseño es editar un componente |
| Almacenamiento PDFs | Supabase Storage | — | URL permanente — historial congelado exactamente como fue generado |
| Auth | JWT + bcrypt + Google OAuth | — | Sistema privado con dos roles, sin overhead de librerías externas |
| Despliegue | Por definir | — | Inicialmente Railway (eliminado por inactividad). Próxima decisión post-entregable 1 |

**Tecnologías descartadas y por qué:**
- Socket.io — para 2 usuarios no justifica la complejidad
- Cloudinary — el proyecto no maneja fotos/videos internamente
- MongoDB — los datos son fuertemente relacionales
- Next.js como backend — se quiere aprender Express explícitamente
- SQL Server — costo de licencia en producción

---

## Comandos del proyecto

**Backend** (`cd backend`)
```bash
npm run dev              # servidor en desarrollo (ts-node-dev, hot reload)
npm run build            # compilar a dist/ (tsc)
npm run seed             # poblar catálogos y usuarios
npx prisma migrate dev   # crear/aplicar migración en desarrollo
npx prisma migrate deploy # aplicar migraciones (entorno destino)
```

**Frontend** (`cd frontend`)
```bash
npm run dev              # Next.js en desarrollo
npm run build            # build de producción
npm run lint             # ESLint
```

---

## Arquitectura

### Despliegue

Monolito. El intento original fue Railway (backend + frontend + PostgreSQL plugin nativo bajo el mismo panel) — los recursos fueron eliminados por inactividad en plan gratuito y el proyecto está pendiente de elegir nuevo proveedor.

```
[Navegador] → HTTPS → [Next.js 14] → HTTP → [Express API] → Prisma → [PostgreSQL]
                                                   ↓
                                            [Supabase Storage]
                                            (PDFs contratos)
```

**Estado actual de infraestructura:**
- **Desarrollo:** PostgreSQL nativo en la PC del desarrollador
- **Docker local:** evaluable más adelante para reproducibilidad de entorno
- **Producción:** decisión postergada hasta entregable 1 — la arquitectura desacoplada permite migrar cambiando solo `DATABASE_URL`

### Decisiones de arquitectura tomadas

| Decisión | Razón |
|---|---|
| Monolito (no microservicios) | Equipo reducido — la complejidad operativa no está justificada |
| Clean Architecture interna en el backend | Mantenibilidad y extensibilidad sin sobredimensionar |
| Desnormalización en contratos | El PDF debe reflejar el acuerdo exactamente como fue firmado, sin importar ediciones futuras |
| JSONB en proformas.servicios | La proforma es un documento libre — cualquier combinación de servicios sin restricciones de schema |
| Tablas de detalle tipadas por servicio | Integridad referencial y consultas limpias para análisis |
| Catálogos como tablas (no enums) | Administrables — se pueden agregar/desactivar sin cambiar código |

> Detalle completo de arquitectura de software y despliegue:
> `docs/Diseño-Tecnico.md`. Diagramas C4 (contexto y
> contenedores): `docs/C4-Arquitectura.md`.

---

## Modelo de datos

El centro del sistema es `eventos`. Todo contrato se genera desde un evento con un botón.
La proforma es un documento independiente y desechable sin relación con ninguna otra entidad.

### Relaciones

```
clientes ──────────────────────► eventos
tipos_evento ──────────────────► eventos
eventos ────────────────────────► evento_servicios
tipos_servicio ─────────────────► evento_servicios
evento_servicios ───────────────► detalle_fotografia
evento_servicios ───────────────► detalle_filmacion
evento_servicios ───────────────► detalle_cuadrofirma
eventos ────────────────────────► contratos (máximo 1)
estados_contrato ───────────────► contratos
proformas (sin relaciones)
```

Modelo de datos: ver `backend/prisma/schema.prisma` (fuente de verdad).
Conservar el diagrama de relaciones y las reglas de dominio no derivables del
schema (desnormalización en contratos, JSONB en proformas).

---

## Infraestructura y dependencias externas

### Railway (hosting — referencia histórica)
Railway fue el primer intento de hosting: backend (Express), frontend (Next.js) y base de datos (PostgreSQL plugin nativo) bajo el mismo panel. El proyecto fue eliminado por inactividad en plan gratuito. **Las referencias en código a Railway son únicamente comentarios — el código no tiene acoplamiento al SDK de Railway.** Los comentarios se mantienen como huella del intento de conexión que se hizo con el servicio.

**Acoplamiento real con Railway:** cero. La única dependencia operativa es `DATABASE_URL` en `.env`, que apunta a cualquier instancia PostgreSQL.

**Cómo migrar a otro proveedor (3 pasos):**
1. Actualizar `DATABASE_URL` en `backend/.env`
2. `npx prisma migrate deploy`
3. `npx prisma db seed`

### Base de datos (entorno actual)
- **Desarrollo:** PostgreSQL nativo en la PC del desarrollador (sin servicios externos)
- **Docker local:** evaluable en una iteración futura si se necesita reproducibilidad de entorno multi-equipo
- **Producción:** decisión postergada hasta entregable 1

### Supabase Storage
Servicio externo planeado. Almacenará los PDFs de contratos generados con URLs permanentes — el historial de contratos nunca cambia aunque se modifique el template.
Variables requeridas: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_BUCKET`.
**Estado:** integración pendiente de implementar (el servicio existe pero el código aún no lo usa).

---

## Módulos del sistema

### 1. Agenda
- Vista principal: calendario mensual
- Múltiples eventos el mismo día y hora (equipo cubre en paralelo)
- Botón "Generar contrato" por evento — crea el contrato automáticamente desde el evento
- Eventos archivados (soft delete) no aparecen por defecto

### 2. Proformas
- PDF generado al vuelo, enviado por WhatsApp
- Sin estados, sin almacenamiento del archivo
- Completamente independiente del resto del sistema
- Adaptable a cualquier combinación de servicios
- Eliminación física (no soft delete) — son documentos desechables por diseño

### 3. Contratos
- Se genera desde el evento con un botón — sin llenar campos adicionales
- PDF almacenado permanentemente en Supabase Storage
- Historial fiel e inmutable (desnormalización intencional)
- Estados: Pendiente → PendienteEntrega → Terminado / Cancelado
- "Eliminar" contrato = transicionar a estado `Cancelado` (no se borra el registro)

### 4. Análisis
- Tipo de evento más contratado
- Meses con más trabajo
- Tasa de conversión proforma → contrato
- Ingresos cobrados vs proyectados
- Servicios más contratados

### 5. Autenticación
- Login con usuario/contraseña (JWT + bcrypt)
- Login con Google OAuth
- Sin registro público — usuarios creados por seed
- Roles: admin, dueno, viewer — extensibles sin reestructurar la auth

### Contexto de negocio operativo
- Moneda: Soles peruanos (S/)
- Ciudad: Lima, Perú
- Comunicación con clientes: WhatsApp
- Flujo típico: consulta → proforma por WhatsApp → confirmación → contrato generado desde el evento → cobertura → entrega → terminado

---

## Estado actual del proyecto

Estado actual y pendientes: ver RUTA.md.

---

## Sistema de subagentes

> Los subagents están registrados en `.claude/agents/` con frontmatter; Claude Code
> los descubre e invoca automáticamente según su `description`.

Este proyecto usa orquestación con subagentes especializados vía la herramienta Task
de Claude Code. Para activar el modo orquestador ejecutar:

```
claude --dangerously-skip-permissions
```

### Subagentes disponibles

| Subagente | CLAUDE.md | Responsabilidad |
|---|---|---|
| Backend | backend/CLAUDE.md | Endpoints, casos de uso, Prisma, Clean Architecture |
| Frontend | frontend/CLAUDE.md | Páginas, componentes, UI, integración con API |
| Base de datos | backend/CLAUDE.md | Schema Prisma, migraciones, seeds |
| Revisor | .claude/agents/review-agent.md | Revisión de código, coherencia arquitectónica |
| Design | .claude/agents/design-agent.md | Definir estructura visual de componentes nuevos |

### Cómo delegar con Task

- Para implementar un endpoint → Task al subagente backend con contexto del endpoint
- Para construir una pantalla → Task al subagente frontend con wireframe o descripción
- Para un cambio de schema → Task al subagente de base de datos con el cambio requerido
- Para revisar código generado → Task al revisor con los archivos modificados
- Para definir la estructura visual de un componente nuevo → Task al design-agent con el nombre y propósito del componente

### Directorio raíz del proyecto

```
D:/MIGUEL PRODUCCIONES/Gestor Eventos/
├── backend/               ← dominio del subagente backend
├── frontend/              ← dominio del subagente frontend
├── docs/
│   ├── Diseño-Tecnico.md  ← arquitectura detallada, modelo de datos, flujos de secuencia
│   ├── Docker.md          ← guía para levantar entorno local con Docker (uso futuro)
│   └── C4-Arquitectura.md ← diagramas C4 del sistema (contexto y contenedores)
├── .claude/               ← configuración Claude Code
└── CLAUDE.md              ← este archivo — fuente de verdad del proyecto
```

