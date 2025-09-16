#!/bin/bash

# Script para levantar el frontend con Docker
set -e

echo "🎨 Iniciando Frontend con Docker..."

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado desde .env.example"
        echo "🔧 Configuración por defecto aplicada:"
        echo "   - Frontend: http://localhost:3001"
        echo "   - API Backend: http://localhost:3000/api"
        echo "   - Socket.IO: http://localhost:3000"
    else
        echo "❌ Error: .env.example no encontrado"
        echo "   Creando .env con configuración por defecto..."
        cat > .env << 'EOF'
# Configuración del Frontend React + Vite

# URL de la API backend (con prefijo /api)
VITE_API_URL=http://localhost:3000/api

# URL de la aplicación backend (para Socket.IO)
VITE_APP_URL=http://localhost:3000

# Nombre de la aplicación
VITE_APP_NAME=Reto Frontend

# Entorno de desarrollo
VITE_NODE_ENV=development

# Puerto del frontend en Docker
FRONTEND_PORT=3001

# Token de Google Maps (limitado a 1000 requests diarias)
VITE_GMAPS_KEY=AIzaSyA2sstJmncuvCTw2WUsBe6ykcA0WlnGJ3s

# Configuración de desarrollo y debugging
VITE_DEBUG_MODE=false
VITE_STRICT_MODE=false
VITE_SHOW_GRID=false
VITE_LOG_LEVEL=info
EOF
        echo "✅ Archivo .env creado con configuración por defecto"
    fi
else
    echo "✅ Archivo .env encontrado"
fi

echo "🔍 Verificando red Docker compartida..."

# Verificar si la red externa existe
if ! docker network ls | grep -q "reto_tecnico_network"; then
    echo "⚠️  La red 'reto_tecnico_network' no existe"
    echo "   Primero debes levantar el backend con: yarn setup-backend"
    echo "   O crear la red manualmente con:"
    echo "   docker network create reto_tecnico_network"
    exit 1
fi

echo "✅ Red compartida encontrada"

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    exit 1
fi

echo "🐳 Construyendo y levantando frontend..."

# Construir y levantar el servicio
docker-compose up -d --build

echo ""
echo "🎉 ¡Frontend desplegado exitosamente!"
echo ""
echo "🔗 URLs disponibles:"
echo "   - Frontend: http://localhost:3001"
echo "   - API Backend: http://localhost:3000/api"
echo ""
echo "🛠️ Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Parar: docker-compose down"
echo "   - Reconstruir: docker-compose up -d --build"
