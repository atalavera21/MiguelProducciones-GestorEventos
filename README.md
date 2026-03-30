# Gestor de Eventos — Miguel Producciones

Sistema web de gestión administrativa para **Miguel Producciones**, empresa de fotografía y video especializada en eventos sociales en Lima, Perú. Centraliza la gestión de clientes, agenda, proformas y contratos en una sola herramienta.

---

## El problema que resuelve

Miguel Producciones opera con un equipo de 5-6 personas cubriendo bodas, quinceañeras, bautizos y otros eventos sociales. Sin un sistema centralizado, la operación depende de conversaciones de WhatsApp, documentos sueltos y memoria — lo que genera:

- Contratos sin historial trazable
- Proformas hechas manualmente sin formato consistente
- Agenda gestionada informalmente, sin visibilidad del equipo
- Imposibilidad de medir métricas del negocio (conversión, ingresos, carga de trabajo)

Este sistema resuelve esos puntos sin sobredimensionar la solución — es una herramienta interna, privada, diseñada para la realidad operativa de una empresa de fotografía independiente.

---

## Funcionalidades principales

- **Agenda** — calendario mensual con soporte para múltiples eventos simultáneos
- **Proformas** — generación de PDF profesional para enviar por WhatsApp
- **Contratos** — generación de PDF con almacenamiento en la nube para historial permanente
- **Análisis** — métricas de negocio: conversión, ingresos, carga mensual
- **Autenticación** — acceso privado con roles (admin y dueño)

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma 6 |
| Base de datos | PostgreSQL |
| Frontend | Next.js 14 (App Router) + React |
| PDF | @react-pdf/renderer |
| Almacenamiento | Supabase Storage |
| Auth | JWT + bcrypt + Google OAuth |
| Despliegue | Railway |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Docker](https://www.docker.com/) y Docker Compose (para levantar el entorno local)
- Cuenta en [Railway](https://railway.app/) (para producción)
- Cuenta en [Supabase](https://supabase.com/) (para almacenamiento de PDFs)

---

## Levantar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-eventos.git
cd gestor-eventos
```

### 2. Configurar variables de entorno

```bash
# Backend
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus valores:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestor_eventos"
JWT_SECRET="tu_secreto_largo_y_aleatorio"
NODE_ENV="development"
```

### 3. Levantar con Docker

```bash
docker-compose up --build
```

Eso levanta automáticamente:
- PostgreSQL en `localhost:5432`
- Backend (Express) en `localhost:3001`
- Frontend (Next.js) en `localhost:3000`

### 4. Ejecutar migraciones

En una terminal separada, una vez que los contenedores estén corriendo:

```bash
docker exec -it gestor-eventos-backend npx prisma migrate dev
```

Listo — la app está disponible en `http://localhost:3000`.

---

## Estructura del proyecto

```
gestor-eventos/
├── backend/                  # API REST — Express + Prisma + Clean Architecture
│   ├── prisma/
│   │   └── schema.prisma     # Modelos y migraciones
│   └── src/
│       ├── domain/           # Entidades e interfaces — sin dependencias externas
│       ├── application/      # Casos de uso — lógica de negocio
│       ├── infrastructure/   # Prisma, Supabase, JWT — implementaciones concretas
│       └── presentation/     # Rutas y controladores de Express
│
├── frontend/                 # UI — Next.js 14 + React
│
├── docker-compose.yml        # Entorno local completo con un solo comando
└── README.md
```

---

## Despliegue en producción

El proyecto se despliega en [Railway](https://railway.app/). Cada push a `main` desencadena un deploy automático.

**Servicios en Railway:**
- `backend` — conectado al repositorio GitHub, rama `main`
- `frontend` — conectado al repositorio GitHub, rama `main`
- `PostgreSQL` — plugin nativo de Railway

**Variables de entorno en producción:**

En Railway, el backend usa `DATABASE_URL` (conexión interna entre servicios).
Configura además `JWT_SECRET` y `NODE_ENV=production` desde el panel de Railway.

---

## Documentación

| Documento | Descripción |
|---|---|
| [`docs/diseño-tecnico.md`](docs/diseño-tecnico.md) | Arquitectura, stack, diagramas, base de datos y decisiones técnicas |

---

## Autor

**Adrián Talavera** — desarrollador Full Stack  
[LinkedIn](https://linkedin.com/in/tu-perfil) · [Portfolio](https://tu-portfolio.com)
