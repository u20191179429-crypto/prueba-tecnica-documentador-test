import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { Solicitud } from '../../models/solicitud.model';

/**
 * Componente de lista de solicitudes.
 * Muestra una tabla con todos los registros y permite filtrar por estado.
 */
@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="page-header animate-fade-in-up">
        <div class="header-icon">
          <i class="bi bi-list-check"></i>
        </div>
        <div>
          <h1 class="page-title">Solicitudes</h1>
          <p class="page-subtitle">Gestión y seguimiento de todas las solicitudes registradas</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="stats-row animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="stat-card">
          <div class="stat-icon total">
            <i class="bi bi-inbox-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ solicitudes.length }}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pendiente">
            <i class="bi bi-clock-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ contarPorEstado('Pendiente') }}</span>
            <span class="stat-label">Pendientes</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon procesado">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <div class="stat-info">
            <span class="stat-number">{{ contarPorEstado('Procesado') }}</span>
            <span class="stat-label">Procesados</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filter-bar glass-card animate-fade-in-up" style="animation-delay: 0.15s" id="filter-bar">
        <div class="filter-label">
          <i class="bi bi-funnel me-2"></i> Filtrar por estado:
        </div>
        <div class="filter-buttons">
          <button
            class="filter-btn"
            [class.active]="filtroActual === 'Todos'"
            (click)="onFiltrar('Todos')"
            id="filter-todos"
          >
            <i class="bi bi-grid-3x3-gap me-1"></i> Todos
          </button>
          <button
            class="filter-btn pendiente"
            [class.active]="filtroActual === 'Pendiente'"
            (click)="onFiltrar('Pendiente')"
            id="filter-pendiente"
          >
            <i class="bi bi-clock me-1"></i> Pendiente
          </button>
          <button
            class="filter-btn procesado"
            [class.active]="filtroActual === 'Procesado'"
            (click)="onFiltrar('Procesado')"
            id="filter-procesado"
          >
            <i class="bi bi-check2-circle me-1"></i> Procesado
          </button>
        </div>
      </div>

      <!-- Tabla de solicitudes -->
      <div class="table-container glass-card animate-fade-in-up" style="animation-delay: 0.2s">
        <!-- Loading -->
        <div *ngIf="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando solicitudes...</p>
        </div>

        <!-- Error -->
        <div *ngIf="errorMessage" class="alert alert-danger m-3" id="table-error-alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          {{ errorMessage }}
        </div>

        <!-- Tabla -->
        <div *ngIf="!isLoading && !errorMessage" class="table-responsive">
          <table class="table table-custom mb-0" id="solicitudes-table">
            <thead>
              <tr>
                <th scope="col">#ID</th>
                <th scope="col">Tipo</th>
                <th scope="col">Asunto</th>
                <th scope="col">Prioridad</th>
                <th scope="col">Estado</th>
                <th scope="col">Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let solicitud of solicitudes; let i = index" class="animate-fade-in" [style.animation-delay]="(i * 0.05) + 's'">
                <td>
                  <span class="id-badge">{{ solicitud.id }}</span>
                </td>
                <td>
                  <div class="tipo-cell">
                    <i class="bi" [ngClass]="getTipoIcon(solicitud.tipo)"></i>
                    {{ solicitud.tipo }}
                  </div>
                </td>
                <td>
                  <div class="asunto-cell" [title]="solicitud.asunto">
                    {{ solicitud.asunto }}
                  </div>
                </td>
                <td>
                  <span [ngClass]="getPrioridadClass(solicitud.prioridad)">
                    {{ solicitud.prioridad }}
                  </span>
                </td>
                <td>
                  <span [ngClass]="getEstadoClass(solicitud.estado || '')">
                    {{ solicitud.estado }}
                  </span>
                </td>
                <td>
                  <span class="fecha-cell">{{ formatFecha(solicitud.fechaCreacion) }}</span>
                </td>
              </tr>
              <tr *ngIf="solicitudes.length === 0 && !isLoading">
                <td colspan="6" class="text-center py-5">
                  <div class="empty-state">
                    <i class="bi bi-inbox empty-icon"></i>
                    <p class="empty-text">No se encontraron solicitudes</p>
                    <p class="empty-subtext">{{ filtroActual !== 'Todos' ? 'Intente con otro filtro' : 'Aún no hay solicitudes registradas' }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

    /* Stats */
    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 20px;
    }

    .stat-card {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 20px;
      background: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      transition: var(--transition-base);
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .stat-icon.total { background: #ede9fe; color: #7c3aed; }
    .stat-icon.pendiente { background: #fff7ed; color: #ea580c; }
    .stat-icon.procesado { background: #ecfdf5; color: #059669; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    /* Filtros */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 20px;
      margin-bottom: 20px;
    }

    .filter-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    .filter-btn {
      padding: 6px 16px;
      border-radius: 20px;
      border: 1.5px solid #e2e8f0;
      background: white;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
    }

    .filter-btn:hover {
      border-color: var(--primary-light);
      color: var(--primary);
    }

    .filter-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .filter-btn.pendiente.active {
      background: #ea580c;
      border-color: #ea580c;
    }

    .filter-btn.procesado.active {
      background: #059669;
      border-color: #059669;
    }

    /* Tabla */
    .table-container {
      overflow: hidden;
      padding: 0;
    }

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

    .tipo-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .tipo-cell i {
      font-size: 1rem;
      color: var(--primary-light);
    }

    .asunto-cell {
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .fecha-cell {
      font-size: 0.8rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    /* Empty state */
    .empty-state {
      padding: 20px;
    }

    .empty-icon {
      font-size: 3rem;
      color: #cbd5e1;
    }

    .empty-text {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-top: 12px;
      margin-bottom: 4px;
    }

    .empty-subtext {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .stats-row {
        flex-direction: column;
      }

      .filter-bar {
        flex-direction: column;
        align-items: flex-start;
      }

      .filter-buttons {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ListaSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  filtroActual = 'Todos';
  isLoading = false;
  errorMessage = '';
  private todasLasSolicitudes: Solicitud[] = [];

  constructor(
    private solicitudService: SolicitudService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  /**
   * Carga todas las solicitudes desde la API.
   */
  cargarSolicitudes(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.solicitudService.listarTodas().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.todasLasSolicitudes = [...data];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.errorMessage = 'No tiene permisos para ver todas las solicitudes.';
        } else {
          this.errorMessage = 'Error al cargar las solicitudes. Verifique la conexión con el servidor.';
        }
      }
    });
  }

  /**
   * Filtra las solicitudes por estado.
   */
  onFiltrar(estado: string): void {
    this.filtroActual = estado;
    this.errorMessage = '';

    if (estado === 'Todos') {
      this.isLoading = true;
      this.solicitudService.listarTodas().subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.todasLasSolicitudes = [...data];
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar las solicitudes.';
        }
      });
    } else {
      this.isLoading = true;
      this.solicitudService.filtrarPorEstado(estado).subscribe({
        next: (data) => {
          this.solicitudes = data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Error al filtrar las solicitudes.';
        }
      });
    }
  }

  /**
   * Cuenta solicitudes por estado (usando datos locales).
   */
  contarPorEstado(estado: string): number {
    return this.todasLasSolicitudes.filter(s => s.estado === estado).length;
  }

  /**
   * Retorna la clase CSS para el badge de prioridad.
   */
  getPrioridadClass(prioridad: string): string {
    const map: { [key: string]: string } = {
      'Alta': 'badge-alta',
      'Media': 'badge-media',
      'Baja': 'badge-baja'
    };
    return map[prioridad] || '';
  }

  /**
   * Retorna la clase CSS para el badge de estado.
   */
  getEstadoClass(estado: string): string {
    const map: { [key: string]: string } = {
      'Pendiente': 'badge-pendiente',
      'Procesado': 'badge-procesado'
    };
    return map[estado] || '';
  }

  /**
   * Retorna el ícono según el tipo de solicitud.
   */
  getTipoIcon(tipo: string): string {
    const map: { [key: string]: string } = {
      'Certificado': 'bi-file-earmark-text',
      'Constancia': 'bi-file-earmark-check',
      'Petición': 'bi-file-earmark-richtext',
      'Queja': 'bi-exclamation-circle',
      'Otro': 'bi-file-earmark'
    };
    return map[tipo] || 'bi-file-earmark';
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
