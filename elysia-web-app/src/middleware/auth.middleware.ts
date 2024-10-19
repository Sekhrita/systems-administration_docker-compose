import jwt from 'jsonwebtoken';
import { Context } from 'elysia';

export const verifyJWT = async (ctx: Context) => {
  const cookieHeader = ctx.request.headers.get('cookie');
  console.log('Cookie Header Received:', cookieHeader); // Log para verificar si la cookie está presente

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
        // No uses `return` aquí, permite que el flujo continúe hasta el siguiente middleware
      } catch (err) {
        console.error('Error al verificar el token:', err);
        ctx.redirect('/login');
        return; // Redirigir y finalizar si el token es inválido
      }
    } else {
      console.log('No se encontró un token válido, redireccionando a /login');
      ctx.redirect('/login');
      return; // Redirigir y finalizar si no hay token
    }
  } else {
    console.log('No se encontró un token válido, redireccionando a /login');
    ctx.redirect('/login');
    return; // Redirigir y finalizar si no hay token
  }
};
