# Koda Backend

Koda es una API RESTful construida con **Node.js** y **Express** para gestionar proyectos y tareas (estilo Kanban). Está diseñada siguiendo los principios de **Clean Architecture** para garantizar un código escalable, mantenible y altamente desacoplado.

## 🚀 Tecnologías Principales

*   **Entorno:** Node.js
*   **Framework:** Express.js
*   **Base de Datos:** PostgreSQL (alojado en Neon)
*   **Driver DB:** `pg` (manejo nativo con Connection Pooling)
*   **Validación de Datos:** Zod
*   **Seguridad:** Bcrypt.js (Hasheo de contraseñas), CORS, Helmet (recomendado).
*   **Gestor de Paquetes:** Yarn Berry (v4)

---

## 🏗 Arquitectura del Proyecto (Clean Architecture)

El proyecto está dividido en 4 capas principales para separar las responsabilidades:

```text
src/
├── domain/             # Lógica de Negocio Pura (Entidades)
│   └── entities/       # Modelos del negocio (ej. User, Project, Ticket)
├── application/        # Casos de Uso (La "intención" del sistema)
│   └── use-cases/      # ej. RegisterUser, CreateTicket
├── infrastructure/     # Detalles técnicos externos (Base de datos, servicios de terceros)
│   ├── database/       # db.js (Pool de pg) y schema.sql (Estructura de la BD)
│   └── repositories/   # Implementación concreta del acceso a datos (ej. PostgresUserRepository)
└── interfaces/         # Puntos de entrada y salida (HTTP)
    ├── controllers/    # Manejan la petición HTTP y llaman a los Casos de Uso
    ├── middleware/     # Interceptores (ej. errorHandler, validator)
    ├── routes/         # Definición de endpoints (con index.js como agregador)
    └── validators/     # Esquemas de Zod para validar (req.body, params)
```

### Reglas de Dependencia
*   `domain` no depende de **nada**.
*   `application` depende de `domain`.
*   `interfaces` e `infrastructure` dependen de `application` y `domain`.

---

## 🛠 Instalación y Configuración Local

### 1. Requisitos Previos
*   [Node.js](https://nodejs.org/) (v18 o superior recomendado)
*   [Yarn](https://yarnpkg.com/)
*   Una instancia de PostgreSQL (puedes usar [Neon.tech](https://neon.tech/))

### 2. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd koda_backend
```

### 3. Instalar dependencias
El proyecto utiliza Yarn. Ejecuta:
```bash
yarn install
```

### 4. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en las credenciales de tu base de datos:

```env
PORT=3000

# Base de Datos (PostgreSQL)
DB_USER=tu_usuario
DB_HOST=tu_host.neon.tech
DB_NAME=tu_base_de_datos
DB_PASSWORD=tu_password
```

### 5. Configurar la Base de Datos
Ejecuta el script SQL principal en tu base de datos para crear las tablas, índices y triggers necesarios.
El script se encuentra en: `src/infrastructure/database/schema.sql`

---

## 🚦 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

*   `yarn dev`: Inicia el servidor en modo desarrollo utilizando `nodemon`. El servidor se reiniciará automáticamente si haces cambios en el código.
*   `yarn start`: Inicia el servidor en modo producción usando node estándar.

---

## 🔌 API Endpoints (Activos)

La API está versionada y agrupada bajo el prefijo `/api`.

### Autenticación
*   `POST /api/auth/register`: Registra un nuevo usuario.
    *   **Body esperado:** `{ "name": "...", "email": "...", "password": "..." }`
    *   **Validación:** Manejada automáticamente por el middleware de Zod.

### Health Check
*   `GET /`: Retorna el estado de la API para confirmar que está en línea.

---

## 🛡 Manejo de Errores

La API cuenta con un manejador de errores global (`src/interfaces/middleware/errorHandler.js`). Si un Caso de Uso lanza un error (ej. "Usuario ya existe"), debe asignarle un `statusCode` (ej. 400). El manejador atrapará el error y devolverá una respuesta JSON estandarizada para el Frontend.