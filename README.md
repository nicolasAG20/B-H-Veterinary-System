# B&H Veterinary System — bh-core

API REST para el sistema de gestión veterinaria Breaze & Harold, construida con NestJS, TypeORM y MySQL.

---

## Requisitos previos

- Node.js >= 18
- npm >= 9
- MySQL >= 8
- Base de datos creada: `bh_core`

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
cd bh-core
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env
# (o crear .env manualmente, ver sección Variables de entorno)

# 3. Ejecutar migraciones
npm run migration:run

# 4. Poblar usuario administrador por defecto
npm run seed

# 5. Iniciar en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/v1`.

---

## Variables de entorno

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=bh_core

JWT_SECRET=tu_secreto_jwt
JWT_EXPIRATION=1h

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=tu_usuario_mailtrap
MAIL_PASS=tu_password_mailtrap
MAIL_FROM=noreply@bh-vet.com
```

---

## Migraciones

```bash
# Aplicar todas las migraciones pendientes
npm run migration:run

# Generar una nueva migración a partir de cambios en entidades
npm run migration:generate -- src/migrations/NombreMigracion

# Revertir la última migración aplicada
npm run migration:revert
```

---

## Seeder

Crea el usuario administrador por defecto (`admin@bh.com` / `Admin123`) si no existe:

```bash
npm run seed
```

---

## Endpoints implementados

### Autenticación — `/api/v1/auth`

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| POST | `/auth/register` | Registra un nuevo usuario y envía código de verificación al correo | `{ "nombre", "correo", "contrasena", "rol" }` |
| POST | `/auth/verify-email` | Verifica el código de 6 dígitos recibido por correo | `{ "correo", "codigo_verificacion" }` |
| POST | `/auth/login` | Autentica al usuario y retorna un JWT | `{ "correo", "contrasena" }` |

**Roles disponibles:** `CLIENTE`, `RECEPCIONISTA`, `VETERINARIO`, `ADMINISTRADOR`

**Flujo de registro:**
1. `POST /auth/register` → estado `PENDIENTE_VERIFICACION`, se envía código al correo
2. `POST /auth/verify-email` → CLIENTE pasa a `ACTIVO`; VETERINARIO/RECEPCIONISTA pasan a `PENDIENTE_APROBACION`
3. El administrador aprueba con `PATCH /users/{userId}/approve` → estado `ACTIVO`

---

### Administración de usuarios — `/api/v1/users`

Todos los endpoints requieren `Authorization: Bearer <token>` con rol `ADMINISTRADOR`.

| Método | Ruta | Descripción | Body |
|--------|------|-------------|------|
| GET | `/users` | Lista todos los usuarios | — |
| GET | `/users/:userId` | Obtiene un usuario por ID | — |
| PATCH | `/users/:userId/approve` | Aprueba una cuenta en estado `PENDIENTE_APROBACION` | — |
| PATCH | `/users/:userId/reject` | Rechaza una cuenta | `{ "motivo" }` |
| PATCH | `/users/:userId/suspend` | Suspende una cuenta activa | `{ "motivo" }` |

---

## Códigos de respuesta comunes

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos o código de verificación incorrecto/expirado |
| 401 | Credenciales inválidas o token ausente/expirado |
| 403 | Cuenta no activa o rol sin permisos |
| 404 | Recurso no encontrado |
| 409 | Conflicto (correo duplicado o estado incorrecto) |
