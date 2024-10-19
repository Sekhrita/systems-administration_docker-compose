import { createUser, findUserByUsername } from './auth.repository';
import jwt from 'jsonwebtoken';

export const register = async (username: string, password: string) => {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('Usuario ya existe');
  }
  return await createUser({ username, password });
};

export const login = async (username: string, password: string) => {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  const validPassword = await Bun.password.verify(password, user.password);
  if (!validPassword) {
    throw new Error('Contraseña incorrecta');
  }

  // Generar el token JWT
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });

  return token;
};
