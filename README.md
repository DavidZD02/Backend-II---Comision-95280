# Torneos Deportivos API

## Descripción

API REST construida con **Node.js**, **Express** y **MongoDB (Mongoose)** para una plataforma de **torneos deportivos**: los organizadores publican torneos y los jugadores se inscriben en ellos.

Proyecto del curso Backend II, organizado por capas y construido por entregas:

| Entrega | Contenido |
|---|---|
| Pre-entrega 1 | Estructura base por capas, configuración de entorno, `GET /api/health` y `GET /api/events` |
| **Pre-entrega 2** | **Registro seguro de usuarios** (`POST /api/sessions/register`): validación, normalización de email, hash de contraseña con bcrypt y persistencia en MongoDB |

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
- bcrypt (hash de contraseñas)

Próximas entregas: JWT, Passport, cookie-parser y Nodemailer.

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
| `MONGO_URL` | Cadena de conexión a MongoDB Atlas, incluyendo el nombre de la base de datos | **Sí** | — |
| `JWT_SECRET` | Secreto para firmar tokens JWT (se usará en la próxima entrega) | **Sí** | — |

Ejemplo de `MONGO_URL`:

```
mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/torneos-deportivos?retryWrites=true&w=majority
```

Para generar un `JWT_SECRET` aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Si falta una variable obligatoria, la aplicación no arranca y muestra cuál falta:

```
Error: faltan las siguientes variables de entorno: MONGO_URL
```

> Si la conexión a Atlas falla por "IP not whitelisted", agrega tu IP en *Security → Network Access* dentro de MongoDB Atlas.

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
| POST | `/api/sessions/register` | Registro de usuario | ✅ Implementada |
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

### `POST /api/sessions/register`

Registra un nuevo usuario con rol `user`.

**Headers:** `Content-Type: application/json` (también acepta `application/x-www-form-urlencoded`)

#### Campos que espera

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `first_name` | String | Sí | — |
| `last_name` | String | Sí | — |
| `email` | String | Sí | Formato de email válido. Se normaliza con `trim` + `lowercase` antes de validar y guardar. Debe ser único. |
| `password` | String | Sí | Mínimo 6 caracteres. Se guarda hasheada con bcrypt. |

Cualquier otro campo del body se **ignora**. En particular, `role` **no puede enviarse en el registro público**: todo usuario registrado por este endpoint queda con rol `user`.

#### Request de ejemplo

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

#### Respuestas

**`201` — usuario creado** (email normalizado y **sin** el campo `password`):

```json
{
  "status": "success",
  "payload": {
    "id": "6af27edd7de67c901fcc7433",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

**`400` — datos inválidos.** Posibles mensajes:

| Causa | `message` |
|---|---|
| Falta algún campo obligatorio | `Faltan campos obligatorios` |
| Algún campo no es texto (por ejemplo `"email": 12345`) | `Los campos deben ser de tipo string` |
| Email con formato inválido | `Formato de email inválido` |
| Contraseña demasiado corta | `La contraseña debe tener al menos 6 caracteres` |

```json
{ "status": "error", "message": "Faltan campos obligatorios" }
```

**`409` — email ya registrado** (la comparación se hace sobre el email normalizado, así que `Ana@Mail.com ` y `ana@mail.com` se consideran el mismo):

```json
{ "status": "error", "message": "El email ya está registrado" }
```

#### Cómo probarlo

Con el servidor corriendo, en Postman o Insomnia: `POST http://localhost:8080/api/sessions/register` con **Body → raw → JSON**.

O desde la terminal:

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ana","last_name":"Pérez","email":"Ana@Mail.com ","password":"Secreta123"}'
```

Casos verificados:

| # | Caso | Resultado esperado |
|---|---|---|
| 1 | Registro exitoso | `201` con email normalizado y sin `password` |
| 2 | Campos faltantes | `400` `Faltan campos obligatorios` |
| 3 | Email con formato inválido (`ana-mail.com`) | `400` `Formato de email inválido` |
| 4 | Email ya registrado (repetir el caso 1) | `409` `El email ya está registrado` |
| 5 | Contraseña en la base de datos | En la colección `users` de MongoDB Atlas, el campo `password` es un hash que empieza por `$2b$10$`, nunca el texto plano |
| 6 | Respuesta del endpoint | El `payload` no incluye `password` (ni en texto plano ni hasheada) |
| 7 | Envío de `"role": "admin"` en el body | `201` con `"role": "user"`: el rol se ignora |

#### Evidencias

Respuesta del registro exitoso (sin el campo `password`):

![Respuesta del registro en Postman](docs/register-postman.png)

Usuario guardado en MongoDB Atlas con la contraseña hasheada:

![Usuario en MongoDB Atlas](docs/register-atlas.png)

### Rutas pendientes de `sessions` → `501`

Tienen ruta y controlador propios, pero todavía sin lógica de autenticación:

```json
{ "status": "error", "message": "Login: pendiente de implementación" }
```

### Ruta inexistente → `404`

```json
{ "status": "error", "message": "Ruta no encontrada: GET /api/otra-cosa" }
```

## Seguridad en el registro

- **Hash con bcrypt:** la contraseña se transforma con `bcrypt.hash` (10 salt rounds) antes de guardarse. bcrypt agrega un *salt* aleatorio, por lo que dos usuarios con la misma contraseña tienen hashes distintos. La lógica está en el helper reutilizable `src/utils/hash.js`, que también expone `isValidPassword` (basado en `bcrypt.compare`) para el login de la próxima entrega.
- **Sin password en la respuesta:** el service no devuelve el documento de Mongoose, sino un **DTO** (`src/dto/user.dto.js`) que copia solo los campos públicos (`id`, `first_name`, `last_name`, `email`, `role`). Funciona como lista blanca: un campo sensible que se agregue al modelo en el futuro no se expone a menos que se incluya explícitamente.
- **Rol no manipulable:** el service desestructura solo `first_name`, `last_name`, `email` y `password` del body, por lo que un `role` enviado por el cliente nunca llega a la base de datos. El modelo asigna `user` por defecto.
- **Email único:** se valida en el service (respuesta `409`) y además el modelo define `email` con `unique: true`.

## Manejo de errores

El service lanza errores con la clase `AppError` (`src/utils/appError.js`), que incluye el código HTTP en la propiedad `status`. El método estático `AppError.assert(condición, mensaje, status)` lanza el error si la condición no se cumple.

Express 5 envía automáticamente los errores de los controllers `async` al middleware `errorHandler`, que responde con `err.status` (o `500` si no existe). Los errores `4xx` siempre muestran su mensaje; los `500` lo ocultan en producción para no exponer detalles internos.

## Arquitectura

Cada capa tiene una sola responsabilidad y solo conoce a la capa inmediatamente inferior:

```
Request → routes → controllers → services → repositories → dao → models → MongoDB
```

Flujo del registro:

```
POST /api/sessions/register
  → sessions.router        conecta la ruta con el controller
  → sessions.controller    pasa req.body al service y responde 201
  → sessions.service       valida, normaliza, verifica duplicado, hashea y devuelve el DTO
  → users.repository       intermediario sin lógica
  → users.dao              findOne / create con Mongoose
  → User (modelo)
```

| Capa | Responsabilidad |
|---|---|
| **config/** | Carga y valida las variables de entorno (`env.config.js`) y conecta a MongoDB (`database.config.js`). |
| **routes/** | Definen URLs y métodos HTTP, y delegan en el controlador. Se crean con *factories* que reciben el service. |
| **controllers/** | Leen la petición, llaman al service y arman la respuesta HTTP. |
| **services/** | Lógica de negocio: validaciones, normalización, reglas. No conocen `req` ni `res`. |
| **repositories/** | Intermediarios entre services y DAO. No saben qué base de datos hay debajo. |
| **dao/** | Única capa que habla con Mongoose. |
| **models/** | Schemas de Mongoose (`User`, `Event`). |
| **dto/** | Definen qué datos salen hacia el cliente (`UserDTO`). |
| **middlewares/** | Manejo de rutas no encontradas (404) y de errores. |
| **utils/** | Helpers reutilizables: hash de contraseñas (`hash.js`) y errores con status (`appError.js`). |

Las dependencias se inyectan por constructor en `app.js` (`DAO → Repository → Service → Router`), por lo que ninguna capa crea sus propias dependencias.

`app.js` configura Express (middlewares, routers y composición de capas) y lo exporta; `server.js` conecta a la base de datos y levanta el servidor. Separarlos permite testear la app sin abrir un puerto.

## Modelos

### `User` (jugador / organizador / admin)

```js
{
  first_name: String,   // obligatorio
  last_name: String,    // obligatorio
  email: String,        // obligatorio, único, guardado en minúsculas y sin espacios
  password: String,     // obligatorio, guardado como hash de bcrypt
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
Backend-II---Comision-95280/
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
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── dto/
│   │   └── user.dto.js
│   ├── middlewares/
│   │   ├── notFound.middleware.js
│   │   └── errorHandler.middleware.js
│   └── utils/
│       ├── hash.js
│       └── appError.js
├── docs/
│   ├── register-postman.png
│   └── register-atlas.png
├── .env.example
├── .gitignore
├── package.json
└── README.md
```