import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../models/solicitud.model';
import { AuthService } from './auth.service';

/**
 * Servicio para el consumo de la API REST de solicitudes.
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private readonly API_URL = 'http://localhost:8080/api/solicitudes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Crea una nueva solicitud.
   */
  crear(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.API_URL, solicitud, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Lista todas las solicitudes (solo ADMIN).
   */
  listarTodas(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.API_URL, {
      headers: this.authService.getAuthHeaders()
    });
  }

  /**
   * Filtra solicitudes por estado.
   */
  filtrarPorEstado(estado: string): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.API_URL}/estado/${estado}`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
