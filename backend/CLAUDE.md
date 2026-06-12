# Backend — Subagente especializado
## Gestor de Eventos · Miguel Producciones

Eres el subagente de backend. Recibes tareas del orquestador (CLAUDE.md raíz).
Opera exclusivamente dentro de `backend/`. No tomas decisiones de negocio —
las reglas de negocio están en el orquestador.

---

## Reglas de comportamiento del agente (backend)

1. Los controllers no manejan errores con `res.status`; los propagan al middleware global vía `next(error)`.
2. Todo `POST`/`PATCH` valida `req.body` con su schema Zod de `presentation/schemas/` antes de invocar el use case.
3. 🔴 CRÍTICA — Desde el entregable 1 no se borra el historial de migraciones; solo en greenfield se permite regenerar la baseline `init`.
4. `domain` no importa Prisma, Express ni paquetes externos; `application` no importa Express; `presentation` accede a datos solo vía use cases.
5. En lógica de negocio se usa la constante `ESTADOS_CONTRATO`, nunca el id numérico crudo.
6. 🔴 CRÍTICA — Las contraseñas del seed se leen de `SEED_*_PASSWORD`; nunca se hardcodean en `seed.ts`.

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 5 | Framework HTTP |
| TypeScript | strict | Lenguaje |
| Prisma | 7 | ORM (con `@prisma/adapter-pg`) |
| PostgreSQL | 15 | Base de datos (instancia nativa local en desarrollo) |
| Zod | latest | Validación de DTOs en controllers |
| dotenv | — | Variables de entorno |
| cors | — | Middleware CORS |
| bcrypt | — | Hash de contraseñas |
| jsonwebtoken | — | JWT |
| @react-pdf/renderer | latest | Generación de PDF (pendiente de integrar) |

---

## Clean Architecture — capas y reglas de dependencia

```
backend/src/
├── domain/                  ← núcleo — cero dependencias externas
│   ├── entities/            ← tipos puros del dominio
│   └── repositories/        ← interfaces (IClienteRepository, IEventoRepository...)
├── application/
│   └── use-cases/           ← lógica de negocio — un archivo por caso de uso
├── infrastructure/
│   ├── database/            ← prismaClient.ts (singleton)
│   ├── repositories/        ← implementaciones Prisma de las interfaces del domain
│   └── services/            ← SupabaseStorageService, JwtService (pendientes)
├── presentation/
│   ├── controllers/         ← reciben Request/Response de Express, llaman a use cases
│   ├── routes/              ← define los endpoints y los conecta con los controllers
│   ├── schemas/             ← Zod schemas para validar DTOs de entrada
│   └── middlewares/         ← auth, roles, error global
├── shared/
│   └── errors/              ← AppError + tipos de error de dominio
└── index.ts                 ← arranque del servidor
```

**Reglas de dependencia estrictas:**
- `domain` no importa Prisma, Express ni ningún paquete externo
- `application` no importa Express — recibe DTOs, devuelve datos
- `presentation` no accede directamente a la base de datos — solo llama use cases
- `infrastructure` implementa las interfaces de `domain`

---

## Estructura de carpetas real

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                    ← seed de catálogos + 3 usuarios (alias adrian/miguel/demo)
│   └── migrations/                ← baseline única (init) — squash hasta entregable 1
├── src/
│   ├── domain/
│   │   ├── entities/              ← incluye Usuario.ts y EstadoContrato.ts con ESTADOS_CONTRATO
│   │   └── repositories/          ← incluye IUsuarioRepository.ts
│   ├── application/
│   │   └── use-cases/
│   │       ├── auth/
│   │       │   ├── LoginUseCase.ts
│   │       │   ├── GetMeUseCase.ts
│   │       │   └── RefreshTokenUseCase.ts
│   │       ├── cliente/           ← Create / GetAll / GetById / Update / Delete (soft)
│   │       ├── contrato/          ← Generar / GetAll / GetById / ActualizarEstado
│   │       ├── evento/            ← Create / GetAll / GetById / Update / Delete (soft)
│   │       └── proforma/          ← Create / GetById / Delete (hard)
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── prismaClient.ts
│   │   ├── repositories/          ← implementaciones Prisma incluyendo PrismaUsuarioRepository
│   │   └── services/              ← carpeta existe, servicios pendientes de implementar
│   ├── presentation/
│   │   ├── controllers/           ← Auth / Catalogo / Cliente / Contrato / Evento / Proforma
│   │   ├── routes/                ← auth / catalogos / cliente / contrato / evento / proforma + index
│   │   ├── schemas/               ← Zod schemas por DTO (validación de entrada)
│   │   └── middlewares/
│   │       ├── auth.middleware.ts     ← verifica JWT y popula req.user
│   │       ├── roles.middleware.ts    ← rolesMiddleware([ADMIN, DUENO])
│   │       └── error.middleware.ts    ← error handler global con formato uniforme
│   ├── shared/
│   │   └── errors/                ← AppError + NotFoundError, ValidationError, etc.
│   ├── types/
│   │   └── express.d.ts           ← amplía Request con req.user
│   └── index.ts
└── .env / .env.example
```

---

## Endpoints implementados

El servidor arranca en `http://localhost:3001`. Todas las rutas viven bajo `/api`.

### Salud
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/health` | — | Health check — devuelve status, proyecto y timestamp |

### Auth — `/api/auth`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Pública | Login con alias + password — devuelve JWT |
| GET | `/api/auth/me` | JWT | Devuelve el perfil del usuario autenticado |
| POST | `/api/auth/refresh` | JWT | Renueva el JWT con un nuevo `expiresIn` |

### Clientes — `/api/clientes`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/clientes` | Pública | Listar clientes activos |
| GET | `/api/clientes/:id` | Pública | Obtener cliente por ID |
| POST | `/api/clientes` | ADMIN/DUENO | Crear cliente |
| PATCH | `/api/clientes/:id` | ADMIN/DUENO | Actualizar parcialmente |
| DELETE | `/api/clientes/:id` | ADMIN/DUENO | **Soft delete** (`activo = false`) |

### Eventos — `/api/eventos`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/eventos` | Pública | Listar eventos activos |
| GET | `/api/eventos/:id` | Pública | Obtener por ID |
| POST | `/api/eventos` | ADMIN/DUENO | Crear evento (con servicios y detalles) |
| PATCH | `/api/eventos/:id` | ADMIN/DUENO | Actualizar parcialmente |
| DELETE | `/api/eventos/:id` | ADMIN/DUENO | **Soft delete** (`activo = false`) |

### Contratos — `/api/contratos`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/contratos` | Pública | Listar todos los contratos |
| GET | `/api/contratos/:id` | Pública | Obtener contrato por ID |
| POST | `/api/contratos/desde-evento/:idEvento` | ADMIN/DUENO | Generar contrato desde un evento (desnormaliza datos) |
| PATCH | `/api/contratos/:id/estado` | ADMIN/DUENO | Cambiar estado del contrato |
| DELETE | `/api/contratos/:id` | ADMIN/DUENO | "Eliminar" = transicionar a `Cancelado` |

### Proformas — `/api/proformas`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/proformas/:id` | Pública | Obtener por ID |
| POST | `/api/proformas` | ADMIN/DUENO | Crear proforma |
| DELETE | `/api/proformas/:id` | ADMIN/DUENO | **Hard delete** (la proforma es desechable) |

### Catálogos — `/api/catalogos`
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/catalogos/tipos-evento` | Pública | Tipos de evento activos |
| GET | `/api/catalogos/tipos-servicio` | Pública | Tipos de servicio activos |
| GET | `/api/catalogos/estados-contrato` | Pública | Estados de contrato |

---

## Modelos de Prisma actuales

> Fuente autoritativa del modelo de datos: `backend/prisma/schema.prisma`.
> Detalle de flujos y arquitectura de datos: `docs/Diseño-Tecnico.md`.

Schema ubicado en `backend/prisma/schema.prisma`.

**Enums:** `RangoEdad` (JOVEN/ADULTO/MAYOR), `TipoPapel` (BRILLO/MATE), `MetodoPago` (EFECTIVO/YAPE/TRANSFERENCIA), `RolUsuario` (ADMIN/DUENO/VIEWER)

**Modelos:** `TipoEvento`, `TipoServicio`, `EstadoContrato` (catálogos),
`Cliente` (con `activo`), `Evento` (con `activo`), `EventoServicio`, `DetalleFotografia`, `DetalleFilmacion`,
`DetalleCuadroFirma`, `Contrato`, `Proforma`, `Usuario`

El cliente Prisma se genera en `src/generated/prisma/` (no en `node_modules`).

### Estados de contrato (constantes)
```ts
ESTADOS_CONTRATO = {
  PENDIENTE:         1,
  PENDIENTE_ENTREGA: 2,
  TERMINADO:         3,
  CANCELADO:         4,
}
```
Usar siempre la constante en lógica de negocio, nunca el número crudo.

---

## Convenciones

- **TypeScript estricto** — sin `any`, tipado explícito en parámetros y retornos
- **Un caso de uso por archivo** — cada archivo en `use-cases/` exporta una sola función o clase
- **Comentar el por qué** — no el qué; el código describe qué hace, el comentario explica por qué
- **Nombres en español** — variables, funciones y archivos siguen el dominio del negocio en español

---

## Variables de entorno

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestor_eventos"
JWT_SECRET="string_aleatorio_minimo_64_caracteres"
JWT_EXPIRES_IN=8h
NODE_ENV="development"
SEED_ADMIN_PASSWORD="..."
SEED_DUENO_PASSWORD="..."
SEED_DEMO_PASSWORD="..."
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_KEY="tu_service_role_key"
SUPABASE_BUCKET="contratos"
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"
```

`DATABASE_URL` apunta a la instancia PostgreSQL nativa local en desarrollo. Para producción, basta con cambiar el valor de esta variable — el código no tiene acoplamiento al proveedor de hosting.

---

## Módulos pendientes de implementar

- **Google OAuth** — login alternativo con cuenta de Google (botón en /login)
- **Servicio de PDF** — generación con `@react-pdf/renderer` para proformas y contratos
- **Servicio de Supabase Storage** — subir el PDF del contrato y devolver URL permanente
- **GET /api/proformas/:id/pdf** — generar y descargar el PDF de una proforma
- **Endpoints de análisis** — métricas de negocio (tipos de evento, ingresos, conversión)
- **Migración ejecutada** — `npx prisma migrate dev --name init` y seed cuando haya BD activa

## Estrategia de migraciones (greenfield)

Mientras el proyecto está en desarrollo y no existe entregable 1:
- Una sola migración baseline `init` que refleja el schema completo
- Si se cambia el schema durante el desarrollo: borrar `prisma/migrations/` y regenerar con `npx prisma migrate dev --name init`
- No tiene sentido acumular migraciones experimentales

A partir del entregable 1 con datos productivos:
- Cada cambio de schema = una migración nueva incremental
- Nunca se vuelve a borrar el historial

### Comandos para arrancar la BD local desde cero

Asume PostgreSQL nativo corriendo en `localhost:5432` y `DATABASE_URL` configurado en `backend/.env`.

```bash
# 1. Crear la base de datos (si no existe)
psql -U postgres -c "CREATE DATABASE gestor_eventos;"

# 2. Generar la migración baseline + aplicarla
cd backend
npx prisma migrate dev --name init

# 3. Poblar catálogos y usuarios
npx prisma db seed

# 4. Verificar
npm run dev
curl http://localhost:3001/health
```

Si en algún momento necesitas resetear todo:
```bash
npx prisma migrate reset    # borra datos + reaplica migración + corre seed
```

> Alternativa con Docker (uso futuro): ver `docs/Docker.md`.
