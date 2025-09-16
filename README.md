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
- **API Backend**: http://localhost:3000/api (debe estar corriendo)

### 📄 Páginas disponibles:

#### 🔐 **Páginas Autenticadas** (requieren login):
- `/login` - Página de inicio de sesión
- `/home` - Dashboard con gráficas de envíos
- `/sends` - Gestión de envíos (CRUD)
- `/drivers` - Gestión de conductores (solo administradores)

#### 🌐 **Páginas Públicas**:
- `/tracking` - Rastreo público de envíos por unique_id

### 🔌 **API Endpoints**:

Todas las rutas del backend usan el prefijo `/api`:

#### **Autenticación**:
- `POST /api/login` - Iniciar sesión

#### **Dashboard**:
- `GET /api/home/charts-data` - Datos para gráficas (autenticado)

#### **Envíos**:
- `GET /api/sends/getSendsFiltered` - Listar envíos (autenticado)
- `POST /api/sends/create` - Crear envío (autenticado)
- `PUT /api/sends/update/:id` - Actualizar envío (autenticado)

#### **Conductores**:
- `GET /api/drivers/drivers` - Listar conductores (admin)
- `POST /api/drivers/create` - Crear conductor (admin)

#### **Tracking**:
- `GET /api/home/tracking/:unique_id` - Rastreo público por ID
- `GET /api/home/tracking` - Listar envíos (autenticado)

### 👤 **Credenciales de Acceso**:

#### **Administrador**:
- **Email**: `a@mail.com`
- **Contraseña**: `123456`
- **Permisos**: Acceso completo a todas las funcionalidades

#### **Usuario Regular**:
- **Email**: `afd@mail.com`
- **Contraseña**: `12345678`
- **Permisos**: Solo puede ver y gestionar sus propios envíos

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
- `VITE_API_URL`: URL del backend con prefijo API (ej: http://localhost:3000/api)
- `FRONTEND_PORT`: Puerto del frontend (por defecto: 3001)
- `VITE_APP_NAME`: Nombre de la aplicación

## 🔧 Desarrollo local

Para desarrollo sin Docker:

```bash
# Instalar dependencias
yarn install

# Configurar .env con la URL del backend local (incluyendo /api)
echo "VITE_API_URL=http://localhost:3000/api" > .env

# Iniciar en modo desarrollo
yarn dev
```

## ✨ Funcionalidades

### 🔐 **Página de Login** (`/login`)
- Autenticación con JWT
- Validación de credenciales
- Redirección automática al dashboard
- Soporte para múltiples idiomas (ES/EN)

### 📊 **Dashboard** (`/home`)
- **Gráficas interactivas** con Chart.js:
  - **Línea de tiempo** de envíos por estado con datos diarios
  - **4 datasets**: Creados, En Tránsito, Entregados, Cancelados
  - **Incluye día actual** en todos los rangos de fechas
  - **Filtros dinámicos**:
    - **Período**: 7, 15, 30 días
    - **Usuario específico** (solo para administradores)
- **Tarjetas de resumen** con iconos y métricas en tiempo real
- **Datos filtrados por rol**: 
  - **Admins**: Ven todos los envíos o de un usuario específico
  - **Usuarios normales**: Solo ven sus propios envíos

### 📦 **Gestión de Envíos** (`/sends`)
- Tabla interactiva con paginación
- Crear, editar y actualizar envíos
- Asignación de conductores y rutas
- Cambio de estados (En espera → En tránsito → Entregado/Cancelado)
- Validaciones de capacidad del vehículo
- Filtros por usuario y estado

### 🚛 **Gestión de Conductores** (`/drivers`) - Solo Administradores
- CRUD completo de conductores
- Validación de CIFNIF único
- Tabla con paginación del lado del cliente
- Restricción de acceso por permisos

### 🔍 **Rastreo Público** (`/tracking`)
- **Acceso sin autenticación**
- Búsqueda por `unique_id`
- **Stepper visual** que muestra:
  - Estado actual del envío
  - Timestamps de cada fase
  - Indicadores visuales diferenciados para cancelados
- **Actualizaciones en tiempo real** con Socket.IO
- **Selector de idioma** integrado
- Validación de permisos (usuarios solo ven sus envíos)

### 🌐 **Características Técnicas**
- **Internacionalización** (i18n) - Español, Inglés y Francés
- **Socket.IO** para actualizaciones en tiempo real
- **Responsive Design** con Bootstrap
- **TypeScript** para tipado estricto
- **Context API** para manejo de estado global
- **Hooks personalizados** para lógica reutilizable
- **Validación de permisos** por rol de usuario

## 🌍 Internacionalización (i18n)

El proyecto soporta múltiples idiomas usando **react-i18next**. Actualmente incluye:

- 🇪🇸 **Español** (`es`) - Idioma por defecto
- 🇺🇸 **Inglés** (`en`) - Idioma de respaldo
- 🇫🇷 **Francés** (`fr`) - Ejemplo de extensión

### 📝 **Estructura de Archivos de Idioma**

Los diccionarios se encuentran en `src/languages/`:

```
src/languages/
├── es.json    # Español
├── en.json    # Inglés
└── fr.json    # Francés (ejemplo)
```

### ⚙️ **Configuración i18n**

La configuración se encuentra en `src/i18n.ts`:

```typescript
import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Importar traducciones
import en from "./languages/en.json";
import es from "./languages/es.json";
import fr from "./languages/fr.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr }
};

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ["en", "es", "fr"],
    fallbackLng: "en",
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      escapeValue: false
    }
  });
```

### 🆕 **Cómo Agregar un Nuevo Idioma**

#### **Paso 1: Crear el archivo de diccionario**

Crea un nuevo archivo JSON en `src/languages/`. Por ejemplo, para italiano (`it.json`):

```json
{
    "dic-index": "Italiano",
    "english": "Inglese",
    "spanish": "Spagnolo", 
    "french": "Francese",
    "italian": "Italiano",
    "login": "Accedi",
    "register": "Registrati",
    "username": "Nome utente",
    "password": "Password",
    "admin": "Amministratore",
    "user": "Utente",
    "email": "Email",
    "full-name": "Nome completo",
    "success": "Successo",
    "error": "Errore",
    "logout": "Disconnetti",
    "menu": "Menu",
    "home": "Casa",
    "dashboard": "Cruscotto",
    "sends": "Invii",
    "drivers": "Autisti",
    "tracking": "Tracciamento",
    "created": "Creati",
    "in-transit": "In transito",
    "delivered": "Consegnati",
    "cancelled": "Annullati"
    // ... resto de traducciones
}
```

#### **Paso 2: Actualizar la configuración i18n**

Modifica `src/i18n.ts`:

```typescript
// 1. Importar el nuevo idioma
import it from "./languages/it.json";

// 2. Agregarlo a resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  it: { translation: it }  // ← Nuevo idioma
};

// 3. Agregarlo a supportedLngs
i18n.init({
  // ...
  supportedLngs: ["en", "es", "fr", "it"], // ← Incluir aquí
  // ...
});
```

#### **Paso 3: Actualizar otros archivos de idioma**

Agregar la traducción del nuevo idioma en todos los diccionarios existentes:

**`es.json`:**
```json
{
  "italian": "Italiano"
  // ... resto de traducciones
}
```

**`en.json`:**
```json
{
  "italian": "Italian"
  // ... resto de traducciones
}
```

**`fr.json`:**
```json
{
  "italian": "Italien"
  // ... resto de traducciones
}
```

### 🔧 **Uso en Componentes**

```typescript
import { useTranslation } from 'react-i18next';

function MiComponente() {
  const { t, i18n } = useTranslation();

  // Traducción simple
  const titulo = t('login'); // → "Iniciar sesión" (ES)

  // Cambiar idioma programáticamente
  const cambiarIdioma = (idioma: string) => {
    i18n.changeLanguage(idioma);
  };

  // Interpolación de variables
  const mensaje = t('showing-notifications', { count: 5 });
  // → "Mostrando 10 de 5 notificaciones"

  return (
    <div>
      <h1>{titulo}</h1>
      <button onClick={() => cambiarIdioma('fr')}>
        {t('french')}
      </button>
      <p>{mensaje}</p>
    </div>
  );
}
```

### 📋 **Claves de Traducción Importantes**

#### **Navegación y UI**
- `login`, `logout`, `menu`, `home`, `dashboard`
- `search`, `create`, `edit`, `delete`, `save`, `cancel`
- `loading`, `no-data`, `try-again`

#### **Estados de Envíos**
- `created`, `in-transit`, `delivered`, `cancelled`
- `waiting`, `tracking`, `shipments`

#### **Formularios**
- `username`, `password`, `email`, `full-name`
- `required-field`, `invalid-email`, `form-validation-error`

#### **Mensajes del Sistema**
- `success`, `error`, `warning`, `server-error`
- `unauthorized`, `forbidden`, `not-found`

### 🌐 **Detección Automática de Idioma**

El sistema detecta automáticamente el idioma del navegador usando `i18next-browser-languagedetector`:

1. **Configuración del navegador** (preferencia principal)
2. **LocalStorage** (idioma seleccionado previamente)
3. **Idioma de respaldo** (`en` - inglés)

### 💡 **Mejores Prácticas**

1. **Usa claves descriptivas**: `user-created` en lugar de `msg1`
2. **Mantén consistencia**: Usa el mismo estilo en todas las traducciones
3. **Interpola variables**: `"showing-notifications": "Mostrando {{count}} notificaciones"`
4. **Agrupa por contexto**: `login-error`, `login-success`, `login-required`
5. **Traduce todos los idiomas**: Mantén sincronizados todos los diccionarios

## 📁 Estructura

- `src/` - Código fuente React + TypeScript
  - `components/` - Componentes reutilizables
  - `pages/` - Páginas de la aplicación
  - `contexts/` - Context providers (Auth, Axios, Theme)
  - `hooks/` - Hooks personalizados
  - `types/` - Definiciones de TypeScript
  - `languages/` - **Archivos de traducción i18n**
    - `es.json` - Diccionario en español
    - `en.json` - Diccionario en inglés  
    - `fr.json` - Diccionario en francés (ejemplo)
  - `i18n.ts` - **Configuración de internacionalización**
- `scripts/` - Scripts de automatización Docker
- `docker-compose.yml` - Configuración de contenedor
- `Dockerfile` - Imagen del frontend
- `nginx.conf` - Configuración del servidor web