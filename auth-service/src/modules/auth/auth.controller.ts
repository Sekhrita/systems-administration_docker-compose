import { Elysia } from 'elysia';
import { register, login } from './auth.service';

export const authController = (app: Elysia) => {
  app.post('/auth/register', async (ctx) => {
    const { username, password } = ctx.body;
    try {
      const user = await register(username, password);
      return ctx.redirect('/login'); // Redirigir al login después de un registro exitoso
    } catch (error) {
      // Permanecer en el register si hay error
      return ctx.redirect('/register');
    }
  });

  app.post('/auth/login', async (ctx) => {
    const { username, password } = ctx.body;
    try {
      const token = await login(username, password);

      // Configurar la cookie con el JWT (sin `Secure` para entorno local)
      ctx.set.headers['set-cookie'] = `token=${token}; HttpOnly; Path=/; Max-Age=3600`;

      // Redirigir a la página principal si el login es exitoso
      return ctx.redirect('/');
    } catch (error) {
      // Permanecer en login si hay error
      return ctx.redirect('/login');
    }
  });
};
