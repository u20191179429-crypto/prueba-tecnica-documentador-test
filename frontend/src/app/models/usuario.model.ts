/**
 * Interface para la respuesta de autenticación.
 */
export interface Usuario {
  username: string;
  rol: string;
}

/**
 * Interface para las credenciales de login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}
