# Red Social Periferia - Fullstack (Frontend + Backend)

Este repositorio contiene **dos proyectos**:

- **Backend**: API REST con **Node.js + Express + TypeScript** y **PostgreSQL** (TypeORM).
- **Frontend**: SPA con **React + Vite + Tailwind**.

---

## Requisitos

- Node.js (recomendado **18+**)
- npm (o yarn/pnpm)
- PostgreSQL 13+ (local o en Docker)

Verifica:
```bash
node -v
npm -v
psql --version
```

---

## Estructura

Se asume esta estructura (ajusta si tus carpetas se llaman diferente):

```
/
  backend/   # API (Node/TS)
  frontend/  # Web (React/Vite)
```

---

## 1) Backend (API)

### 1.1 Configuración de variables de entorno

Crea un archivo: `backend/.env`

> Si existe un `.env.example` en tu proyecto, úsalo como base.

Ejemplo típico:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=periferia_social

JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
```

### 1.2 Instalar dependencias

```bash
cd backend
npm install
```

### 1.3 Levantar en desarrollo

El backend trae script `dev` (TypeScript con recarga en caliente):

```bash
npm run dev
```

### 1.4 Compilar y ejecutar

```bash
npm run build
npm start
```

### 1.5 (Opcional) Seed de base de datos

Si tu prueba lo requiere, el backend incluye script `seed`:

```bash
npm run seed
```

### 1.6 Pruebas (si aplica)

```bash
npm test
```

---

## 2) Frontend (Web)

### 2.1 Variables de entorno

Crea un archivo: `frontend/.env`

Ejemplo para Vite:

```env
VITE_API_URL=http://localhost:3001
```

### 2.2 Instalar dependencias

```bash
cd frontend
npm install
```

### 2.3 Levantar en desarrollo

```bash
npm run dev
```

La app normalmente queda en: `http://localhost:5173`

### 2.4 Build y preview

```bash
npm run build
npm run preview
```

---

## 3) PostgreSQL con Docker (opcional)

Si no quieres instalar Postgres localmente, puedes usar este `docker-compose.yml` (en la raíz del repo):

```yml
version: "3.9"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: periferia_social
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Levantar:
```bash
docker compose up -d
```

---

## 4) Flujo recomendado para levantar todo

1. Levanta PostgreSQL (local o Docker).
2. Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Abre `http://localhost:5173`

---

## 5) Troubleshooting

- **CORS error**: revisa `CORS_ORIGIN` en el backend y la URL del front.
- **No conecta a BD**: valida credenciales/puerto y que la BD exista.
- **Puerto ocupado**: cambia `PORT` (backend) o el puerto del front.

---

## Scripts confirmados en los package.json

Backend:
- `dev`, `build`, `start`, `seed`, `test`

Frontend:
- `dev`, `build`, `preview`
