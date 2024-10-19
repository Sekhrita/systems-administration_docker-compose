-- Conectar a la base de datos `auth_service`
\connect auth_service;

-- Crear la tabla `users` si no existe
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  token VARCHAR(255)
);
