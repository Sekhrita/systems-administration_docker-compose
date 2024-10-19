import { Elysia } from 'elysia';

const app = new Elysia();

app.get('/status', () => {
  return {
    status: 'OK',
    services: {
      web_app: 'Funcionando',
      auth_service: 'Funcionando',
      database: 'Funcionando',
      redis_cache: 'Funcionando',
    },
  };
});

app.listen(5000, () => {
  console.log('Microservicio de Estado del Sistema corriendo en http://localhost:5000');
});
