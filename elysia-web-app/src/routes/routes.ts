import { Elysia } from 'elysia';
import path from 'path';
import jwt from 'jsonwebtoken';
import { Client } from 'pg';
import fetch from 'node-fetch';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
});

export const webRoutes = (app: Elysia) => {
  // Ruta para servir la página principal (index.html) - ahora protegida
  app.get(
    '/',
    async ({ request }) => {
      const cookieHeader = request.headers.get('cookie');
      let username = 'invitado';
      let currentTime = 'No disponible';
      let serviceStatusHtml = '';

      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        const token = cookies['token'];
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto') as any;
            username = decoded.username;
          } catch (err) {
            console.error('Error al verificar el token:', err);
          }
        }
      }

      // Intentar obtener la hora actual desde Redis
      currentTime = await redis.get('currentTime');
      if (!currentTime) {
        // Conectar a la base de datos para obtener la hora actual si no está en caché
        const client = new Client({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: parseInt(process.env.DB_PORT || '5432', 10),
        });

        try {
          await client.connect();
          const res = await client.query('SELECT NOW()');
          currentTime = res.rows[0].now;
          await redis.set('currentTime', currentTime, 'EX', 60); // Guardar en caché por 60 segundos
        } catch (err) {
          console.error('Error al conectar a la base de datos:', err);
        } finally {
          await client.end();
        }
      }

      // Obtener el estado del sistema desde el microservicio
      try {
        const response = await fetch('http://nginx/status');
        const statusData = await response.json();
        for (const [service, status] of Object.entries(statusData.services)) {
          serviceStatusHtml += `<tr><td>${service}</td><td>${status}</td></tr>`;
        }
      } catch (err) {
        console.error('Error al obtener el estado del sistema:', err);
        serviceStatusHtml = '<tr><td>Error</td><td>No disponible</td></tr>';
      }

      const indexPath = path.join(process.cwd(), 'src/views/index.html');
      let htmlContent = await Bun.file(indexPath).text();
      htmlContent = htmlContent.replace('{{username}}', username);
      htmlContent = htmlContent.replace('{{currentTime}}', currentTime);
      htmlContent = htmlContent.replace('{{serviceStatus}}', serviceStatusHtml);

      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    },
    {
      beforeHandle({ request, redirect }) {
        const cookieHeader = request.headers.get('cookie');
        if (cookieHeader) {
          const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);

          const token = cookies['token'];
          if (token) {
            try {
              jwt.verify(token, process.env.JWT_SECRET || 'secreto');
              console.log('Token válido, acceso permitido');
              return; // Token válido, continúa con el handler
            } catch (err) {
              console.error('Error al verificar el token:', err);
              return redirect('/login'); // Redirigir si el token es inválido
            }
          }
        }
        console.log('No se encontró un token válido, redireccionando a /login');
        return redirect('/login'); // Redirigir si no hay token
      }
    }
  );

  // Ruta para servir la página de login (login.html)
  app.get('/login', async () => {
    const loginPath = path.join(process.cwd(), 'src/views/login.html');
    return new Response(await Bun.file(loginPath).text(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  });

  // Ruta para servir la página de registro (register.html)
  app.get('/register', async () => {
    const registerPath = path.join(process.cwd(), 'src/views/register.html');
    return new Response(await Bun.file(registerPath).text(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  });

  // Ruta para cerrar sesión (logout)
  app.get('/logout', async ({ set, redirect }) => {
    // Eliminar la cookie del token estableciendo su expiración en el pasado
    set.headers['Set-Cookie'] = 'token=; HttpOnly; Path=/; Max-Age=0';
    console.log('Cerrando sesión y redireccionando a /login');
    return redirect('/login');
  });
};
