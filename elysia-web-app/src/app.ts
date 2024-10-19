import { Elysia } from 'elysia';
import { webRoutes } from './routes/routes';

const app = new Elysia();

// Agregar rutas para servir HTML
webRoutes(app);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
