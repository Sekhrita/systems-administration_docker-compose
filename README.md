# Proyecto de Arquitectura Docker con ElysiaJS, PostgreSQL, Redis y Nginx

Este proyecto configura un entorno basado en Docker que incluye una aplicación web utilizando ElysiaJS con Bun, dos bases de datos PostgreSQL, un microservicio de autenticación, un microservicio de estado del sistema y una capa de caching con Redis, orquestados mediante Docker Compose.

## Requisitos previos

- Docker y Docker Compose instalados en el sistema.
- Puerto `8080` disponible para el servidor web.

## Estructura del proyecto

El proyecto está compuesto por los siguientes servicios:

1. **Web App**: Aplicación web utilizando ElysiaJS con Bun, conectada a una base de datos PostgreSQL.
2. **Auth Service**: Microservicio de autenticación que gestiona registros e inicios de sesión, retornando un token JWT.
3. **System Status Service**: Microservicio que devuelve el estado de los servicios dentro del proyecto.
4. **Nginx**: Proxy inverso que direcciona las solicitudes a los servicios correspondientes.
5. **PostgreSQL**: Dos bases de datos PostgreSQL, una para la aplicación web y otra para el servicio de autenticación.
6. **Redis**: Sistema de caching utilizado por la aplicación web para mejorar la eficiencia de las consultas.

## Configuración de los servicios

### 1. Web App (ElysiaJS con Bun)
- Ubicación: `./elysia-web-app`
- Utiliza el framework ElysiaJS ejecutado con Bun.
- Configuración de base de datos: se conecta a PostgreSQL.
- Redis se utiliza para caching.

### 2. Auth Service (Servicio de autenticación)
- Ubicación: `./auth-service`
- Permite registrar y autenticar usuarios utilizando JWT.
- Utiliza su propia instancia de PostgreSQL para almacenar usuarios.

### 3. System Status Service
- Ubicación: `./system-status`
- Proporciona el estado de los servicios (web, autenticación, base de datos, Redis).

### 4. Nginx
- Ubicación: `./nginx/nginx.conf`
- Actúa como un proxy inverso, redirigiendo el tráfico HTTP a los servicios correspondientes.

### 5. PostgreSQL
- **Base de datos Web**: `elysia_app` para la aplicación web.
- **Base de datos Auth**: `auth_service` para el servicio de autenticación.

### 6. Redis
- Utilizado por la aplicación web para caching de datos.

## Instrucciones para ejecutar el entorno

1. Clonar el repositorio del proyecto:
   ```bash
   git clone <repositorio>
   cd <directorio-del-proyecto>
   ```
2. Construir y levantar los contenedores con Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. Acceder a la aplicación web a través de `http://localhost:8080`.

## Probar los servicios

### 1. Web App
- Acceder a `http://localhost:8080` para ver la página principal.
- Se requiere autenticación para acceder al contenido principal.

### 2. Auth Service
- Registrar un usuario:
  ```bash
  curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"username": "usuario", "password": "contraseña"}'
  ```
- Iniciar sesión:
  ```bash
  curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"username": "usuario", "password": "contraseña"}'
  ```

### 3. System Status
- Verificar el estado de los servicios:
  ```bash
  curl http://localhost:8080/status
  ```

## Notas adicionales
- **Variables de entorno**: Las credenciales de base de datos y la clave JWT se configuran mediante variables de entorno en el archivo `docker-compose.yml`.
- **Caching**: Redis se utiliza para almacenar datos en caché y mejorar la eficiencia de las consultas frecuentes.

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un _pull request_ o crea un _issue_ para discutir cualquier cambio que desees realizar.

