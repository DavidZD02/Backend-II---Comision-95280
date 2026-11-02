# Torneos Deportivos API

## Descripción

API REST construida con **Node.js**, **Express** y **MongoDB (Mongoose)** para una plataforma de **torneos deportivos**: los organizadores publican torneos y los jugadores se inscriben en ellos.

Esta es la **Pre-entrega 1** del curso Backend II: la estructura base del proyecto, organizada por capas y lista para crecer en las próximas entregas (autenticación, roles, permisos, inscripciones).

## Temática

**Torneos deportivos con inscripción individual.** Cada jugador se inscribe por su cuenta a un torneo (ajedrez, tenis, pádel, atletismo, e-sports 1v1, etc.).

| Concepto del curso | En este proyecto |
|---|---|
| Event | Torneo |
| Category | Disciplina deportiva (fútbol, ajedrez, pádel…) |
| Inscripción / ticket | Inscripción de un jugador a un torneo |
| Rol `admin` | Administrador de la plataforma |
| Rol `organizer` | Liga, club o federación que crea torneos |
| Rol `user` | Jugador o participante |

## Tecnologías

- Node.js (módulos ESM: `import` / `export`)
- Express 5
- MongoDB Atlas + Mongoose
- dotenv

Próximas entregas: bcrypt, JWT, Passport, cookie-parser y Nodemailer.

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/DavidZD02/Backend-II---Comision-95280.git
cd Backend-II---Comision-95280
```

2. Instalar las dependencias:

```bash
npm install
```

3. Crear el archivo `.env` a partir de `.env.example` y completar los valores:

```bash
cp .env.example .env
```

## Variables de entorno

| Variable | Descripción | Obligatoria | Por defecto |
|---|---|---|---|
| `PORT` | Puerto del servidor | No | `8080` |
| `NODE_ENV` | Entorno de ejecución (`development` / `production`) | No | `development` |
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas | **Sí** | — |
| `JWT_SECRET` | Secreto para firmar tokens JWT (se usará en la próxima entrega) | **Sí** | — |

Si falta una variable obligatoria, la aplicación no arranca y muestra cuál falta:

```
Error: faltan las siguientes variables de entorno: MONGO_URL
```

> Si la conexión a Atlas falla por "IP not whitelisted", agrega tu IP en *Network Access* dentro de MongoDB Atlas.

## Ejecución

```bash
npm start      # arranque normal
npm run dev    # modo desarrollo (reinicia al guardar cambios)
```

Si todo sale bien, verás en consola:

```
Conexión a MongoDB exitosa
Servidor corriendo en http://localhost:8080 (development)
```

## Rutas disponibles

Base URL: `http://localhost:8080`

| Método | Ruta | Descripción | Estado |
|---|---|---|---|
| GET | `/api/health` | Verifica que el servidor está activo | ✅ Implementada |
| GET | `/api/events` | Lista los torneos | ✅ Implementada |
| POST | `/api/sessions/register` | Registro de usuario | 🚧 Responde `501` |
| POST | `/api/sessions/login` | Inicio de sesión | 🚧 Responde `501` |
| GET | `/api/sessions/current` | Usuario autenticado actual | 🚧 Responde `501` |
| POST | `/api/sessions/logout` | Cierre de sesión | 🚧 Responde `501` |

### `GET /api/health` → `200`

```json
{ "status": "ok", "message": "Servidor activo" }
```

### `GET /api/events` → `200`

Recorre todas las capas (`controller → service → repository → DAO → model`). Con la base de datos vacía devuelve:

```json
{ "status": "success", "payload": [] }
```

### Rutas de `sessions` → `501`

Tienen ruta y controlador propios, pero todavía sin lógica de autenticación:

```json
{ "status": "error", "message": "Login: pendiente de implementación" }
```

### Ruta inexistente → `404`

```json
{ "status": "error", "message": "Ruta no encontrada: GET /api/otra-cosa" }
```

## Arquitectura

Cada capa tiene una sola responsabilidad y solo conoce a la capa inmediatamente inferior:

```
Request → routes → controllers → services → repositories → dao → models → MongoDB
```

| Capa | Responsabilidad |
|---|---|
| **config/** | Carga y valida las variables de entorno (`env.config.js`) y conecta a MongoDB (`database.config.js`). |
| **routes/** | Definen URLs y métodos HTTP, y delegan en el controlador. |
| **controllers/** | Leen la petición, llaman al service y arman la respuesta HTTP. |
| **services/** | Lógica de negocio. No conocen `req` ni `res`. |
| **repositories/** | Intermediarios entre services y DAO. No saben qué base de datos hay debajo. |
| **dao/** | Única capa que habla con Mongoose. |
| **models/** | Schemas de Mongoose (`User`, `Event`). |
| **middlewares/** | Manejo de rutas no encontradas (404) y de errores (500). |
| **utils/** | Funciones auxiliares (vacía por ahora). |

`app.js` configura Express (middlewares, routers y composición de capas) y lo exporta; `server.js` conecta a la base de datos y levanta el servidor. Separarlos permite testear la app sin abrir un puerto.

## Modelos

### `User` (jugador / organizador / admin)

```js
{
  first_name: String,   // obligatorio
  last_name: String,    // obligatorio
  email: String,        // obligatorio, único
  password: String,     // obligatorio (se guardará hasheada con bcrypt)
  role: String          // "admin" | "organizer" | "user" (por defecto "user")
}
```

### `Event` (torneo)

```js
{
  title: String,        // nombre del torneo
  description: String,
  date: Date,           // fecha del torneo
  location: String,     // sede
  capacity: Number,     // cupo máximo de jugadores (mínimo 1)
  organizer: ObjectId   // referencia al User que creó el torneo
}
```

Ambos modelos incluyen `createdAt` y `updatedAt` (`timestamps: true`).

## Estructura de carpetas

```
torneos-deportivos-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── env.config.js
│   │   └── database.config.js
│   ├── routes/
│   │   ├── health.router.js
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   └── events.service.js
│   ├── repositories/
│   │   └── events.repository.js
│   ├── dao/
│   │   └── events.dao.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   │   ├── notFound.middleware.js
│   │   └── errorHandler.middleware.js
│   └── utils/
│       └── .gitkeep
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
