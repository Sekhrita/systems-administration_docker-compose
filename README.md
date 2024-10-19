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
   git clone https://github.com/tuusuario/systems-administration_docker-compose.git
   cd systems-administration_docker-compose
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
  - Terminal:
  ```bash
  curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"username": "usuario", "password": "contraseña"}'
  ```
  - Web:
    Acceder a través de `http://localhost:8080/register` y completar el formulario.

- Iniciar sesión:
  - Terminal:
  ```bash
  curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"username": "usuario", "password": "contraseña"}'
  ```
  - Web:
    Acceder a través de `http://localhost:8080/login` y completar el formulario.

### 3. System Status (terminal)
- Verificar el estado de los servicios:
  - Terminal:
  ```bash
  curl http://localhost:8080/status
  ```
  - Web:
    Una vez logeado, se podra acceder a la página principal `http://localhost:8080/` donde aparecere la información en una tabla en caso de funcionar correctamente.

## Funcionamiento de la página web
La página principal está disponible en `http://localhost:8080/`. Para acceder a ella, primero debe iniciar sesión. Si no está autenticado, será redirigido automáticamente a `/login`, donde podrá iniciar sesión o registrarse si no tiene una cuenta. Una vez autenticado, podrá acceder a `/`, donde se mostrará el resultado de un `SELECT NOW()` para verificar la conexión con la base de datos, junto con un mensaje de estado de los servicios del sistema.

## Notas adicionales
- **Variables de entorno**: Las credenciales de base de datos y la clave JWT se configuran mediante variables de entorno en el archivo `docker-compose.yml`.
- **Caching**: Redis se utiliza para almacenar datos en caché y mejorar la eficiencia de las consultas frecuentes.

## Diagrama del Proyecto
```markdown
![Arquitectura del Proyecto](Arquitectura_del_project-docker-compose.png)
```
