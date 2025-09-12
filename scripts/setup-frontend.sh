#!/bin/bash

# Script para levantar el frontend con Docker
set -e

echo "🎨 Iniciando Frontend con Docker..."

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Archivo .env creado"
    else
        echo "❌ Error: .env.example no encontrado"
        exit 1
    fi
fi

# Cargar variables de entorno
source .env

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
echo "   - Frontend: http://localhost:${FRONTEND_PORT:-3001}"
echo "   - API Backend: ${VITE_API_URL}"
echo ""
echo "🛠️ Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Parar: docker-compose down"
echo "   - Reconstruir: docker-compose up -d --build"
