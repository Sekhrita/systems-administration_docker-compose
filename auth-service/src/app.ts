import { Elysia } from 'elysia';
import { authController } from './modules/auth/auth.controller';

const app = new Elysia();

// Incluir el controlador de autenticación
authController(app);

app.listen(4000, () => {
  console.log('Microservicio de autenticación corriendo en http://localhost:4000');
});
