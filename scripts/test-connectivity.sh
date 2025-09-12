#!/bin/bash

# Script para verificar conectividad entre frontend y backend

echo "🔍 Verificando conectividad entre contenedores..."

# Verificar que los contenedores estén corriendo
if ! docker ps | grep -q "backend_api"; then
    echo "❌ Error: Contenedor backend_api no está corriendo"
    echo "   Ejecuta: cd ../backend-reto-tecnico && yarn setup-backend"
    exit 1
fi

if ! docker ps | grep -q "frontend_app"; then
    echo "❌ Error: Contenedor frontend_app no está corriendo"
    echo "   Ejecuta: yarn setup-frontend"
    exit 1
fi

echo "✅ Ambos contenedores están corriendo"

# Verificar red compartida
echo "🌐 Verificando red compartida..."
if ! docker network ls | grep -q "reto_tecnico_network"; then
    echo "❌ Error: Red reto_tecnico_network no existe"
    exit 1
fi

echo "✅ Red compartida existe"

# Verificar conectividad desde frontend hacia backend
echo "🔗 Probando conectividad frontend → backend..."

# Probar conexión HTTP desde el contenedor frontend al backend
if docker exec frontend_app wget -q --spider http://backend_api:3000 2>/dev/null; then
    echo "✅ Frontend puede conectarse al backend"
else
    echo "❌ Frontend NO puede conectarse al backend"
    echo "   Verificando configuración de red..."
    docker exec frontend_app nslookup backend_api || echo "   DNS no resuelve backend_api"
fi

# Mostrar información de red
echo ""
echo "📊 Información de red:"
echo "   Red: reto_tecnico_network"
echo "   Backend: backend_api:3000"
echo "   Frontend: frontend_app:80"

# Mostrar contenedores en la red
echo ""
echo "🐳 Contenedores en la red:"
docker network inspect reto_tecnico_network --format '{{range .Containers}}{{.Name}} ({{.IPv4Address}}){{"\n"}}{{end}}'
