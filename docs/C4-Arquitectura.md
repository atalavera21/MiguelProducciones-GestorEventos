# C4 — Arquitectura del Sistema
## Gestor de Eventos · Miguel Producciones

Diagramas del sistema siguiendo el modelo C4 (Context → Containers → Components → Code).
Este archivo cubre los niveles 1 y 2. Los niveles 3 y 4 se agregarán por módulo según necesidad.

---

## Nivel 1 — Contexto del Sistema

Muestra quién usa el sistema y con qué servicios externos se relaciona.

```mermaid
C4Context
    title Nivel 1 — Contexto del Sistema

    Person(admin, "Admin / Dueño", "Adrián o Miguel. Acceso total: gestiona clientes, eventos, contratos y proformas.")
    Person(viewer, "Viewer", "Miembros del equipo. Solo lectura: consulta agenda, clientes y contratos.")

    System(gestor, "Gestor de Eventos", "Aplicación web privada que centraliza la operación de Miguel Producciones. Reemplaza WhatsApp y documentos sueltos.")

    System_Ext(supabase, "Supabase Storage", "Almacena los PDFs de contratos firmados con URL permanente e inmutable.")
    System_Ext(whatsapp, "WhatsApp", "Canal de comunicación con clientes. Las proformas en PDF se comparten desde aquí.")

    Rel(admin, gestor, "Gestiona la operación completa", "HTTPS")
    Rel(viewer, gestor, "Consulta agenda y contratos", "HTTPS")
    Rel(gestor, supabase, "Almacena PDF al generar contrato", "HTTPS")
    Rel(gestor, whatsapp, "Comparte proformas en PDF", "Manual")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Nivel 2 — Contenedores

Muestra las aplicaciones y bases de datos que componen el sistema y cómo se comunican.

```mermaid
C4Container
    title Nivel 2 — Contenedores del Sistema

    Person(admin, "Admin / Dueño")
    Person(viewer, "Viewer")

    System_Boundary(gestor, "Gestor de Eventos") {
        Container(frontend, "Frontend", "Next.js 14 · TypeScript · Tailwind CSS", "Interfaz web. Maneja auth con JWT, protege rutas, consume la API REST.")
        Container(backend, "Backend API", "Express 4 · Node.js 18 · TypeScript", "API REST con Clean Architecture. Valida JWT, controla roles, ejecuta casos de uso.")
        ContainerDb(db, "Base de Datos", "PostgreSQL 15 · Prisma ORM", "Persiste clientes, eventos, contratos, proformas y usuarios.")
    }

    System_Ext(supabase, "Supabase Storage", "PDFs de contratos. URL permanente.")

    Rel(admin, frontend, "Usa", "HTTPS")
    Rel(viewer, frontend, "Consulta", "HTTPS")
    Rel(frontend, backend, "Llama endpoints", "REST · JSON · Authorization: Bearer JWT")
    Rel(backend, db, "Lee y escribe", "Prisma ORM")
    Rel(backend, supabase, "Sube PDF al generar contrato", "HTTPS")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

---

## Nivel 3 — Componentes (pendiente por módulo)

El nivel 3 desglosa los componentes internos de cada contenedor.
Se agregará por módulo según se vaya profundizando en el sistema.

### Backend — componentes internos (referencia)

```
Presentation Layer
├── Routes           → define los endpoints y los conecta con los controllers
├── Controllers      → reciben Request/Response, delegan al use case correspondiente
└── Middlewares      → authMiddleware (JWT), rolesMiddleware

Application Layer
└── Use Cases        → una clase por caso de uso (LoginUseCase, CreateEvento, GenerarContrato...)

Domain Layer
├── Entities         → tipos puros del negocio (Cliente, Evento, Contrato, Usuario...)
└── Interfaces       → contratos de repositorios (IClienteRepository, IEventoRepository...)

Infrastructure Layer
└── Repositories     → implementaciones Prisma de las interfaces del domain
```

### Frontend — componentes internos (referencia)

```
app/
├── (auth)/login     → página de login
└── (dashboard)/     → páginas protegidas (agenda, proformas, contratos, clientes, análisis)

context/
└── AuthContext      → estado global de auth: usuario, token, login(), logout(), puedeEditar

lib/api/
└── client.ts        → cliente HTTP que agrega el JWT automáticamente en cada request

middleware.ts        → protección de rutas a nivel de edge (Next.js middleware)
```

---

## Cómo usar estos diagramas

- Pegar el bloque `mermaid` en [mermaid.live](https://mermaid.live) para ver y exportar como PNG/SVG
- Compartir con una IA (ChatGPT, Claude) para generar una imagen del diagrama
- Los editores con soporte Mermaid (Notion, Obsidian, VS Code + extensión) los renderizan directamente
