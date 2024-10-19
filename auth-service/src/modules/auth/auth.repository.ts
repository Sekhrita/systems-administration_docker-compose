import { query } from '../../config/database';
import { AuthUser } from './auth.model';

export const createUser = async (user: AuthUser) => {
  const hashedPassword = await Bun.password.hash(user.password);
  const result = await query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [user.username, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByUsername = async (username: string) => {
  const result = await query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
};
