import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { Solicitud } from '../../models/solicitud.model';

/**
 * Componente para filtrar solicitudes por estado.
 * Accesible para roles ADMIN y DOCENTE.
 */
@Component({
  selector: 'app-filtrar-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div class="header-icon">
          <i class="bi bi-funnel-fill"></i>
        </div>
        <div>
          <h1 class="page-title">Filtrar Solicitudes</h1>
          <p class="page-subtitle">Busque solicitudes filtrando por su estado actual</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filter-section glass-card animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="filter-grid">
          <div
            class="filter-card"
            [class.active]="filtroSeleccionado === 'Pendiente'"
            (click)="filtrar('Pendiente')"
            id="filtrar-pendiente"
          >
            <div class="filter-card-icon pendiente">
              <i class="bi bi-clock-fill"></i>
            </div>
            <span class="filter-card-label">Pendiente</span>
            <i class="bi bi-arrow-right filter-arrow"></i>
          </div>

          <div
            class="filter-card"
            [class.active]="filtroSeleccionado === 'Procesado'"
            (click)="filtrar('Procesado')"
            id="filtrar-procesado"
          >
            <div class="filter-card-icon procesado">
              <i class="bi bi-check-circle-fill"></i>
            </div>
            <span class="filter-card-label">Procesado</span>
            <i class="bi bi-arrow-right filter-arrow"></i>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div *ngIf="filtroSeleccionado" class="results-section animate-fade-in-up" style="animation-delay: 0.15s">
        <div class="results-header">
          <h3 class="results-title">
            <i class="bi bi-list-ul me-2"></i>
            Resultados: <span class="results-filter">{{ filtroSeleccionado }}</span>
            <span class="results-count">({{ solicitudes.length }})</span>
          </h3>
        </div>

        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-muted">Cargando...</p>
        </div>

        <!-- Error -->
        <div *ngIf="errorMessage" class="alert alert-danger" id="filtrar-error-alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- Tabla -->
        <div *ngIf="!isLoading && !errorMessage" class="table-container glass-card">
          <div class="table-responsive">
            <table class="table table-custom mb-0" id="filtrar-table">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Tipo</th>
                  <th>Asunto</th>
                  <th>Descripción</th>
                  <th>Prioridad</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let solicitud of solicitudes" class="animate-fade-in">
                  <td><span class="id-badge">{{ solicitud.id }}</span></td>
                  <td>{{ solicitud.tipo }}</td>
                  <td>{{ solicitud.asunto }}</td>
                  <td>
                    <div class="desc-cell" [title]="solicitud.descripcion">
                      {{ solicitud.descripcion }}
                    </div>
                  </td>
                  <td>
                    <span [ngClass]="{
                      'badge-alta': solicitud.prioridad === 'Alta',
                      'badge-media': solicitud.prioridad === 'Media',
                      'badge-baja': solicitud.prioridad === 'Baja'
                    }">{{ solicitud.prioridad }}</span>
                  </td>
                  <td class="fecha-cell">{{ formatFecha(solicitud.fechaCreacion) }}</td>
                </tr>
                <tr *ngIf="solicitudes.length === 0 && !isLoading">
                  <td colspan="6" class="text-center py-4">
                    <i class="bi bi-inbox" style="font-size: 2rem; color: #cbd5e1;"></i>
                    <p class="mt-2 text-muted">No hay solicitudes con estado "{{ filtroSeleccionado }}"</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
      flex-shrink: 0;
      box-shadow: 0 4px 15px rgba(26, 58, 92, 0.3);
    }

    .page-title {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .filter-section {
      padding: 24px;
      margin-bottom: 24px;
    }

    .filter-grid {
      display: flex;
      gap: 16px;
    }

    .filter-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 24px;
      border-radius: var(--radius-md);
      border: 2px solid #e2e8f0;
      cursor: pointer;
      transition: all 0.25s ease;
    }

    .filter-card:hover {
      border-color: var(--primary-light);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .filter-card.active {
      border-color: var(--primary);
      background: rgba(26, 58, 92, 0.04);
    }

    .filter-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
    }

    .filter-card-icon.pendiente { background: #fff7ed; color: #ea580c; }
    .filter-card-icon.procesado { background: #ecfdf5; color: #059669; }

    .filter-card-label {
      font-weight: 700;
      font-size: 1.1rem;
      flex: 1;
    }

    .filter-arrow {
      color: #cbd5e1;
      transition: all 0.2s ease;
    }

    .filter-card:hover .filter-arrow,
    .filter-card.active .filter-arrow {
      color: var(--primary);
      transform: translateX(4px);
    }

    /* Resultados */
    .results-header {
      margin-bottom: 16px;
    }

    .results-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .results-filter {
      color: var(--primary-light);
    }

    .results-count {
      color: var(--text-secondary);
      font-weight: 400;
      font-size: 0.9rem;
    }

    .table-container { padding: 0; overflow: hidden; }

    .id-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #f1f5f9;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--primary);
    }

    .desc-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fecha-cell {
      font-size: 0.8rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .filter-grid {
        flex-direction: column;
      }
    }
  `]
})
export class FiltrarSolicitudesComponent {
  solicitudes: Solicitud[] = [];
  filtroSeleccionado = '';
  isLoading = false;
  errorMessage = '';

  constructor(private solicitudService: SolicitudService) {}

  /**
   * Filtra solicitudes por estado usando la API.
   */
  filtrar(estado: string): void {
    this.filtroSeleccionado = estado;
    this.isLoading = true;
    this.errorMessage = '';

    this.solicitudService.filtrarPorEstado(estado).subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.errorMessage = 'No tiene permisos para filtrar solicitudes.';
        } else {
          this.errorMessage = 'Error al filtrar solicitudes. Verifique la conexión.';
        }
      }
    });
  }

  /**
   * Formatea la fecha para mostrar.
   */
  formatFecha(fecha: string | undefined): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
