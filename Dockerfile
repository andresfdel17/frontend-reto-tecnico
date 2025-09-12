# Dockerfile para Frontend React + Vite
FROM node:22-alpine as build

# Variables de entorno para build
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_NODE_ENV

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar código fuente
COPY . .

# Establecer variables de entorno para Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_NODE_ENV=$VITE_NODE_ENV

# Construir la aplicación para producción
RUN yarn build

# Etapa de producción con Nginx
FROM nginx:alpine

# Copiar archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
