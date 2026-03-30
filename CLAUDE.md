# Gestor de Eventos — Miguel Producciones

## Quién soy

Soy Adrián Talavera (Tatito), desarrollador Full Stack con experiencia en .NET Core,
Angular y SQL Server. En mi trabajo uso Clean Architecture + CQRS/MediatR. Este
proyecto es mi campo de práctica para aprender Node.js, Express y Prisma construyendo
algo que usaré de verdad en mi negocio.

La empresa se llama **Miguel Producciones** — productora audiovisual de eventos sociales
en Lima, Perú. Servicios principales: fotografía y video por horas de cobertura.
Servicios secundarios: cuadro firma, anuarios, alquiler de togas, sesiones fotográficas.
El equipo es de 3-4 personas y puede cubrir múltiples eventos simultáneamente.

---

## Qué es este proyecto

CRM ligero para gestionar el negocio. Dos objetivos:

1. Aprender Node.js + Express + Prisma + PostgreSQL en la práctica
2. Usarlo realmente para gestionar clientes, eventos y contratos

Uso privado — dos usuarios con roles distintos. Sin registro público.
Los usuarios se crean directamente en base de datos mediante seed.

**Usuarios iniciales:**
- Admin (Adrián) — acceso total
- Dueño (padre de Adrián) — acceso según su rol

El sistema de roles está diseñado para ser extensible sin reestructurar la autenticación.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Runtime backend | Node.js | 18+ |
| Framework backend | Express | 4 |
| Lenguaje | TypeScript | — |
| ORM | Prisma | 6 |
| Base de datos | PostgreSQL | 15 |
| PDF | @react-pdf/renderer | latest |
| Auth | JWT + bcrypt + Google OAuth | — |
| Framework frontend | Next.js 14 (App Router) | 14 |
| Almacenamiento PDFs | Supabase Storage | — |
| Despliegue | Railway | — |

**Lo que NO usamos y por qué:**
- Socket.io — descartado, para 2 usuarios no justifica la complejidad
- Cloudinary — descartado, el proyecto no maneja fotos ni videos internamente
- MongoDB — descartado, los datos son fuertemente relacionales
- Next.js como backend — descartado, se quiere aprender Express explícitamente

**Comparación con stack conocido (.NET):**

| .NET | Node.js |
|---|---|
| .NET Runtime | Node.js |
| ASP.NET Core | Express |
| Entity Framework | Prisma |
| DbContext | PrismaClient |
| Migrations | prisma migrate |
| LINQ | prisma.evento.findMany() |
| Controller | Express Router + Controller |
| MediatR Handler | Application Use Case |
| IRepository | Interface en application/ |

---

## Arquitectura

### Despliegue
Monolito en Railway. Backend y frontend son servicios separados en el mismo panel.
PostgreSQL como plugin nativo de Railway.
Supabase Storage como único servicio externo (PDFs de contratos).

```
[Navegador] → HTTPS → [Next.js 14] → HTTP → [Express API] → Prisma → [PostgreSQL]
                                                   ↓
                                            [Supabase Storage]
                                            (PDFs contratos)
```

Docker no interviene en el despliegue. El `docker-compose.yml` es exclusivamente
para levantar el entorno de desarrollo local.

### Backend — Clean Architecture interna

```
backend/src/
├── domain/
│   ├── entities/
│   └── repositories/        ← Interfaces (IClienteRepository, IEventoRepository...)
├── application/
│   └── use-cases/           ← Casos de uso por módulo
├── infrastructure/
│   ├── database/            ← prismaClient.ts (singleton)
│   ├── repositories/        ← Implementaciones Prisma
│   └── services/            ← SupabaseStorageService, JwtService
├── presentation/
│   ├── controllers/
│   ├── routes/
│   └── middlewares/         ← auth, roles, error
└── index.ts
```

**Regla de oro:** domain no conoce Prisma. application no conoce Express.
presentation no accede directamente a la base de datos. Nunca mezclar capas.

### Variables de entorno

```env
PORT=3001
DATABASE_URL="postgresql://postgres:PASSWORD@host:PORT/railway"
JWT_SECRET="string_aleatorio_minimo_64_caracteres"
NODE_ENV="development"
SUPABASE_URL="https://tu-proyecto.supabase.co"
SUPABASE_KEY="tu_service_role_key"
SUPABASE_BUCKET="contratos"
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"
```

Railway expone dos URLs para PostgreSQL:
- `DATABASE_PUBLIC_URL` → desarrollo local (conexión externa)
- `DATABASE_URL` → producción (conexión interna entre servicios Railway)

---

## Modelo de datos

El centro del sistema es `eventos`. Todo contrato se genera desde un evento
con un solo botón. La proforma es un documento independiente y desechable
sin relación directa con ninguna otra entidad.

Los detalles de cada servicio tienen **tablas propias tipadas** para garantizar
integridad referencial y consultas limpias en el módulo de análisis.

### Relaciones

```
clientes ──────────────────────► eventos
tipos_evento ──────────────────► eventos
eventos ────────────────────────► evento_servicios
tipos_servicio ─────────────────► evento_servicios
evento_servicios ───────────────► detalle_fotografia
evento_servicios ───────────────► detalle_filmacion
evento_servicios ───────────────► detalle_cuadrofirma
eventos ────────────────────────► contratos
estados_contrato ───────────────► contratos
proformas (sin relaciones)
```

### `tipos_evento`

| Campo | Tipo PostgreSQL |
|---|---|
| `id` | SMALLINT PK |
| `nombre` | VARCHAR(100) |
| `activo` | BOOLEAN |

### `tipos_servicio`

| Campo | Tipo PostgreSQL |
|---|---|
| `id` | SMALLINT PK |
| `nombre` | VARCHAR(100) |
| `descripcion` | VARCHAR(200) |
| `activo` | BOOLEAN |

Servicios iniciales: `1=Fotografía`, `2=Filmación`, `3=Cuadro Firma`

### `estados_contrato`

| id | Estado |
|---|---|
| 1 | Pendiente |
| 2 | Activo |
| 3 | PendienteEntrega |
| 4 | Terminado |
| 5 | Cancelado |

Estados del contrato: Pendiente → Activo (día del evento) → PendienteEntrega
(evento concluido) → Terminado (confirmación manual con botón simple que aparece
solo después de la fecha del evento). Cancelado disponible desde Pendiente y Activo.

### `clientes`

| Campo | Tipo PostgreSQL | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `nombre` | VARCHAR(150) | — |
| `telefono` | VARCHAR(30) | WhatsApp |
| `dni` | VARCHAR(12) | — |
| `referencia` | VARCHAR(200) | Ej: "Referido por García", "Facebook" |
| `sexo` | BOOLEAN | true=masculino / false=femenino |
| `rangoEdad` | VARCHAR(10) | 18-30, 30-45, 45+ — estimación para análisis |
| `activo` | BOOLEAN | true por defecto |

### `eventos`

| Campo | Tipo PostgreSQL | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `idCliente` | INTEGER FK | → clientes |
| `idTipoEvento` | SMALLINT FK | → tipos_evento |
| `direccion` | VARCHAR(300) | — |
| `fechaHora` | TIMESTAMP | Fecha y hora de inicio |
| `notas` | TEXT | Observaciones internas |

### `evento_servicios`

Registra qué servicios tiene cada evento. `idTipoServicio` permite saber
qué servicios tiene un evento en una sola consulta sin tocar las tablas de detalle.

| Campo | Tipo PostgreSQL | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `idEvento` | INTEGER FK | → eventos |
| `idTipoServicio` | SMALLINT FK | → tipos_servicio |
| `precio` | DECIMAL(10,2) | Precio del servicio en S/ |

### `detalle_fotografia`

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | SERIAL PK | — | — |
| `idEventoServicio` | INTEGER FK | — | → evento_servicios |
| `esDigital` | BOOLEAN | true | Entrega digital |
| `esFisica` | BOOLEAN | false | Entrega física impresa |
| `tipoPapel` | VARCHAR(10) | null | BRILLO o MATE — solo si esFisica=true |
| `notas` | VARCHAR(300) | null | — |

Regla de negocio: fotografía física es siempre limitada.
`esFisica=true` implica que no es ilimitada por definición.

### `detalle_filmacion`

| Campo | Tipo | Default | Descripción |
|---|---|---|---|
| `id` | SERIAL PK | — | — |
| `idEventoServicio` | INTEGER FK | — | → evento_servicios |
| `incluyeHighlight` | BOOLEAN | true | Video resumen incluido |
| `notas` | VARCHAR(300) | null | — |

### `detalle_cuadrofirma`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `idEventoServicio` | INTEGER FK | → evento_servicios |
| `descripcion` | VARCHAR(300) | Descripción del servicio |

### `contratos`

Se genera automáticamente desde el evento. Desnormaliza los datos del cliente
y del evento para preservar el historial fiel independientemente de ediciones futuras.
El PDF se almacena permanentemente en Supabase Storage.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `idEvento` | INTEGER FK | Evento de origen |
| `idEstado` | SMALLINT FK | → estados_contrato |
| `nombreCliente` | VARCHAR(150) | Copiado al momento de la firma |
| `dniCliente` | VARCHAR(12) | Copiado al momento de la firma |
| `telefonoCliente` | VARCHAR(30) | Copiado al momento de la firma |
| `tipoEvento` | VARCHAR(100) | Copiado al momento de la firma |
| `direccionEvento` | VARCHAR(300) | Copiado al momento de la firma |
| `fechaHoraEvento` | TIMESTAMP | Copiado al momento de la firma |
| `montoTotal` | DECIMAL(10,2) | Total en S/ |
| `montoAdelanto` | DECIMAL(10,2) | Adelanto recibido |
| `saldo` | DECIMAL(10,2) | Monto restante a cancelar |
| `metodoPago` | VARCHAR(30) | EFECTIVO, YAPE, TRANSFERENCIA |
| `cuentaPago` | VARCHAR(100) | Número de cuenta o Yape |
| `dniFotografo` | VARCHAR(12) | DNI del representante de la empresa |
| `fechaContrato` | DATE | Fecha de firma |
| `pdfUrl` | VARCHAR(500) | URL del PDF en Supabase Storage |

Cláusulas fijas en el PDF del contrato:
- El adelanto no se reintegra por ningún motivo.
- Pasados 30 días desde la fecha del evento, no hay lugar a reclamo por pérdida
  o deterioro del material entregado o por entregar.

### `proformas`

Documento desechable sin relación con ninguna otra tabla. Se genera al vuelo
y no se almacena el archivo. El campo `servicios` usa JSONB deliberadamente —
es un documento libre que debe adaptarse a cualquier combinación sin restricciones.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | SERIAL PK | — |
| `nombreCliente` | VARCHAR(150) | No es un cliente registrado aún |
| `tipoEvento` | VARCHAR(100) | Descripción libre |
| `fechaEvento` | DATE | — |
| `horario` | VARCHAR(50) | Ej: "09:00 PM — 12:00 AM" |
| `distrito` | VARCHAR(100) | — |
| `referenciaDir` | VARCHAR(200) | Opcional |
| `servicios` | JSONB | Lista de servicios cotizados con precios |
| `total` | DECIMAL(10,2) | Total cotizado en S/ |
| `adelanto` | DECIMAL(10,2) | Monto informativo de separación |
| `creadoEn` | TIMESTAMP | — |

### Enums del sistema

```
RangoEdad:      18-30 | 30-45 | 45+
TipoPapel:      BRILLO | MATE
MetodoPago:     EFECTIVO | YAPE | TRANSFERENCIA
EstadoContrato: Pendiente | Activo | PendienteEntrega | Terminado | Cancelado
```

---

## Módulos del sistema

### 1. Agenda
- Vista principal: calendario mensual
- Múltiples eventos el mismo día y hora (equipo cubre en paralelo)
- Botón "Generar contrato" por evento — crea el contrato automáticamente
- Botón "Terminado" visible solo después de la fecha del evento

### 2. Proformas
- PDF generado al vuelo, enviado por WhatsApp
- Sin estados, sin almacenamiento del archivo
- Completamente independiente del resto del sistema
- Adaptable a cualquier combinación de servicios

### 3. Contratos
- Se genera desde el evento con un botón — sin llenar campos adicionales
- PDF almacenado permanentemente en Supabase Storage
- Historial fiel e inmutable
- Estados: Pendiente → Activo → PendienteEntrega → Terminado / Cancelado

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
- Roles: Admin (Adrián) y Dueño (padre) — extensibles

---

## Documentación del proyecto

Tres documentos en la carpeta `docs/`:

| Archivo | Contenido |
|---|---|
| `README.md` | Contexto del negocio, setup con Docker, despliegue |
| `diseño-tecnico.md` | Stack, arquitectura, diagramas Mermaid, modelo de datos |
| `docker.md` | Configuración Docker y pasos para levantar el entorno local |

---

## Progreso actual

- [x] Arquitectura definida y documentada
- [x] Documentación completa (README, diseño-tecnico, docker)
- [x] Estructura de carpetas del backend creada (Clean Architecture)
- [x] PostgreSQL creado y corriendo en Railway
- [x] Variables de entorno configuradas (.env y .env.example)
- [x] .gitignore configurado correctamente
- [ ] Schema de Prisma actualizado con el modelo de datos final
- [ ] Migración ejecutada (`cd backend` → `npx prisma migrate dev --name init`)
- [ ] Seed inicial (tipos_evento, tipos_servicio, estados_contrato, usuarios)
- [ ] Frontend Next.js 14 inicializado
- [ ] Módulos implementados

### Próximo paso inmediato

Actualizar `prisma/schema.prisma` con el modelo de datos final descrito en este
documento, luego ejecutar la migración.

---

## Contexto de negocio

- Moneda: Soles peruanos (S/)
- Ciudad: Lima, Perú
- Comunicación con clientes: WhatsApp
- Flujo típico: consulta → proforma por WhatsApp → confirmación →
  contrato generado desde el evento → cobertura → entrega → terminado

---

## Cómo trabajamos

- Un concepto a la vez — no avanzar sin confirmación de entendimiento
- Comentar el por qué del código, no solo el qué
- Dos ejemplos al explicar algo nuevo: uno técnico y uno del mundo real
- Honestidad — si algo tiene desventajas o no vale la pena, decirlo
- Clean Architecture estricta — nunca mezclar capas
- TypeScript siempre — tipado estricto en todo el proyecto
