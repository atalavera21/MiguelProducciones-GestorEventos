# Docker — Entorno local

Guía para levantar el entorno de desarrollo completo usando Docker.
Incluye el backend, el frontend y PostgreSQL orquestados con un único comando.

> Este entorno es exclusivo para desarrollo local.
> El despliegue en producción se gestiona directamente desde Railway.

---

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución

No es necesario tener Node.js ni PostgreSQL instalados en la máquina.

---

## Estructura

```
gestor-eventos/
├── docker-compose.yml
├── backend/
│   └── Dockerfile
└── frontend/
    └── Dockerfile
```

---

## Configuración de los archivos Docker

### `docker-compose.yml`

```yaml
version: '3.8'

services:

  db:
    image: postgres:15-alpine
    container_name: gestor-eventos-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gestor_eventos
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - gestor-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gestor-eventos-backend
    env_file:
      - ./backend/.env
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - db
    networks:
      - gestor-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: gestor-eventos-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - gestor-network

volumes:
  postgres_data:

networks:
  gestor-network:
    driver: bridge
```

### `backend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
```

### `frontend/Dockerfile`

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-eventos.git
cd gestor-eventos
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con los siguientes valores para el entorno Docker:

```env
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@db:5432/gestor_eventos"
JWT_SECRET="reemplazar_con_un_secreto_de_minimo_64_caracteres"
NODE_ENV="development"
```

### 3. Construir e iniciar los contenedores

```bash
docker-compose up --build
```

### 4. Ejecutar las migraciones

En una terminal separada, con los contenedores en ejecución:

```bash
docker exec -it gestor-eventos-backend npx prisma migrate dev
```

### 5. Acceder a la aplicación

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| PostgreSQL | localhost:5432 |

---

## Comandos de referencia

```bash
# Iniciar sin reconstruir
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Detener los contenedores
docker-compose down

# Detener y eliminar los datos persistidos
docker-compose down -v

# Ver logs de un servicio
docker-compose logs backend
docker-compose logs frontend

# Abrir terminal en un contenedor
docker exec -it gestor-eventos-backend sh

# Ejecutar el seed de base de datos
docker exec -it gestor-eventos-backend npx prisma db seed
```