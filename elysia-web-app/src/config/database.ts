import { Pool } from 'pg';

// Obtener la configuración desde las variables de entorno
const pool = new Pool({
  user: process.env.DB_USER || 'elysia_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'elysia_app',
  password: process.env.DB_PASSWORD || 'elysia_password',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
