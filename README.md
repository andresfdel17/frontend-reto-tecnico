# Frontend - Reto Técnico

Aplicación frontend desarrollada en React + TypeScript + Vite, con Docker para despliegue.

## 🚀 Despliegue con Docker

```bash
# Un solo comando despliega el frontend
yarn setup-frontend
```

### ⚠️ **Prerequisito importante:**
**Primero debe estar corriendo el backend** para que la red Docker compartida exista:

```bash
# En el directorio del backend
cd ../backend-reto-tecnico
yarn setup-backend

# Luego en el directorio del frontend
cd ../frontend-reto-tecnico  
yarn setup-frontend
```

## 🔗 URLs disponibles

Una vez desplegado:

- **Frontend**: http://localhost:3001
- **API Backend**: http://localhost:3000 (debe estar corriendo)

## 🌐 Comunicación entre contenedores

Los contenedores se comunican a través de una **red Docker compartida**:

- **Red**: `reto_tecnico_network`
- **Backend**: Accesible como `backend` desde el contenedor frontend
- **Frontend**: Accesible como `frontend` desde el contenedor backend
- **Base de datos**: Compartida entre ambos proyectos

## 📋 Comandos disponibles

```bash
# Desarrollo local (sin Docker)
yarn dev

# Docker
yarn setup-frontend     # Levantar con Docker
yarn docker:stop        # Parar contenedores
yarn docker:logs        # Ver logs
yarn docker:rebuild     # Reconstruir imagen

# Build y linting
yarn build              # Construir para producción
yarn lint               # Verificar código
```

## ⚙️ Configuración

Crea tu archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Variables principales:
- `VITE_API_URL`: URL del backend (ej: http://localhost:3000)
- `FRONTEND_PORT`: Puerto del frontend (por defecto: 3001)
- `VITE_APP_NAME`: Nombre de la aplicación

## 🔧 Desarrollo local

Para desarrollo sin Docker:

```bash
# Instalar dependencias
yarn install

# Configurar .env con la URL del backend local
echo "VITE_API_URL=http://localhost:3000" > .env

# Iniciar en modo desarrollo
yarn dev
```

## 📁 Estructura

- `src/` - Código fuente React + TypeScript
- `scripts/` - Scripts de automatización Docker
- `docker-compose.yml` - Configuración de contenedor
- `Dockerfile` - Imagen del frontend
- `nginx.conf` - Configuración del servidor web