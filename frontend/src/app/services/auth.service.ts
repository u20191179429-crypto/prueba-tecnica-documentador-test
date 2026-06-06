import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario, LoginRequest } from '../models/usuario.model';

/**
 * Servicio de autenticación.
 * Maneja el login, logout y almacenamiento de sesión en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  /**
   * Realiza el login enviando credenciales al backend.
   * Almacena las credenciales en localStorage para peticiones posteriores.
   */
  login(credentials: LoginRequest): Observable<Usuario> {
    // Crear header Basic Auth para la petición de login
    const basicAuth = btoa(`${credentials.username}:${credentials.password}`);

    const headers = new HttpHeaders({
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<Usuario>(`${this.API_URL}/login`, credentials, { headers }).pipe(
      tap(usuario => {
        // Guardar datos de sesión en localStorage
        localStorage.setItem('username', usuario.username);
        localStorage.setItem('rol', usuario.rol);
        localStorage.setItem('authToken', basicAuth);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión eliminando los datos de localStorage.
   */
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('rol');
    localStorage.removeItem('authToken');
  }

  /**
   * Verifica si el usuario está autenticado.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Retorna el nombre de usuario actual.
   */
  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  /**
   * Retorna el rol del usuario actual.
   */
  getRol(): string {
    return localStorage.getItem('rol') || '';
  }

  /**
   * Retorna los headers de autorización para peticiones autenticadas.
   */
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken') || '';
    return new HttpHeaders({
      'Authorization': `Basic ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
