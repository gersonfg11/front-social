# Frontend - Back-end Periferia Social

## Requisitos
- Node.js (v16+)
- npm o yarn

## Instalación
1. `npm install`
2. Crear [.env](cci:7://file:///c:/Users/Equipo/Desktop/BACKEND%20PERIFERIA/.env:0:0-0:0) con: `VITE_API_URL=http://localhost:3000/api`

## Iniciar
1. Backend corriendo en puerto 3000
2. `npm run dev`
3. Abrir http://localhost:5173

## Estructura
- `src/pages/` - Páginas principales (Login, Posts, Profile)
- `src/state/` - Contexto de autenticación
- [src/App.tsx](cci:7://file:///c:/Users/Equipo/Desktop/FRONT%20PERIFERIA/src/App.tsx:0:0-0:0) - Componente raíz

## Funcionalidades
- Login/Logout
- Crear/ver publicaciones
- Likes en publicaciones
- Perfil con cambio de contraseña
- Eliminar publicaciones propias (estilo diferenciado)

## Comandos
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build

## URLs
- Desarrollo: http://localhost:5173
- API Backend: http://localhost:3000/api
