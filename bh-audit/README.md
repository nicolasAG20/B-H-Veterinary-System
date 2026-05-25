# B&H Veterinary System — bh-audit

Servicio de trazabilidad del sistema veterinario Breaze & Harold, construido con Spring Boot y MySQL. Recibe y almacena cada evento relevante que ocurre en bh-core, y permite consultarlos con filtros.

---

## Requisitos previos

- Java 21
- Maven >= 3.8
- MySQL >= 8
- Base de datos creada: `bh_audit`

---

## Instalación y arranque

```bash
# 1. Crear la base de datos en MySQL
mysql -u root -p
CREATE DATABASE bh_audit;
exit;

# 2. Configurar las credenciales en application.properties
# Editar src/main/resources/application.properties y reemplazar tu_password

# 3. Iniciar el servicio (la tabla se crea automáticamente al arrancar)
./mvnw spring-boot:run
```

La API queda disponible en `http://localhost:8080/api/v1`.

---

## Variables de configuración

Ubicadas en `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bh_audit
spring.datasource.username=root
spring.datasource.password=tu_password
```

---

## Creación de tablas

No requiere correr migraciones manualmente. Al iniciar la aplicación, Hibernate crea automáticamente la tabla `evento_auditoria` en la base de datos `bh_audit` si no existe.

---

## Endpoints implementados

### Trazabilidad — `/api/v1/audit`

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/audit/events` | Registra un nuevo evento de auditoría (llamado internamente por bh-core) |
| GET | `/audit/events` | Consulta el historial de eventos con filtros opcionales |

#### Filtros disponibles en GET `/audit/events`

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `tipo_accion` | String | Filtra por tipo de acción |
| `usuarioId` | Integer | Filtra por usuario |
| `rol` | String | Filtra por rol (`CLIENTE`, `VETERINARIO`, `RECEPCIONISTA`, `ADMINISTRADOR`) |
| `fechaInicio` | Date | Inicio del rango de fechas |
| `fechaFin` | Date | Fin del rango de fechas |
