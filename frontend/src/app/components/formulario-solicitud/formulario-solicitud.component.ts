import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de formulario para crear nuevas solicitudes.
 * Incluye validaciones reactivas y feedback visual.
 */
@Component({
  selector: 'app-formulario-solicitud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Header -->
          <div class="page-header animate-fade-in-up">
            <div class="header-icon">
              <i class="bi bi-file-earmark-plus"></i>
            </div>
            <div>
              <h1 class="page-title">Nueva Solicitud</h1>
              <p class="page-subtitle">Complete el formulario para registrar una nueva solicitud</p>
            </div>
          </div>

          <!-- Mensaje de éxito -->
          <div *ngIf="successMessage" class="alert alert-success alert-dismissible fade show animate-fade-in-up" role="alert" id="success-alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            {{ successMessage }}
            <button type="button" class="btn-close" (click)="successMessage = ''" aria-label="Cerrar"></button>
          </div>

          <!-- Mensaje de error -->
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show animate-fade-in-up" role="alert" id="error-alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Cerrar"></button>
          </div>

          <!-- Formulario -->
          <div class="form-card glass-card animate-fade-in-up" style="animation-delay: 0.1s">
            <form [formGroup]="solicitudForm" (ngSubmit)="onSubmit()" id="solicitud-form">

              <!-- Tipo de solicitud -->
              <div class="mb-4">
                <label for="tipo" class="form-label">
                  <i class="bi bi-tag me-1"></i> Tipo de Solicitud
                </label>
                <select
                  class="form-select"
                  id="tipo"
                  formControlName="tipo"
                  [class.is-invalid]="solicitudForm.get('tipo')?.invalid && solicitudForm.get('tipo')?.touched"
                >
                  <option value="">-- Seleccione un tipo --</option>
                  <option value="Certificado">Certificado</option>
                  <option value="Constancia">Constancia</option>
                  <option value="Petición">Petición</option>
                  <option value="Queja">Queja</option>
                  <option value="Otro">Otro</option>
                </select>
                <div class="invalid-feedback" *ngIf="solicitudForm.get('tipo')?.errors?.['required'] && solicitudForm.get('tipo')?.touched">
                  Seleccione un tipo de solicitud.
                </div>
              </div>

              <!-- Asunto -->
              <div class="mb-4">
                <label for="asunto" class="form-label">
                  <i class="bi bi-chat-left-text me-1"></i> Asunto
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="asunto"
                  formControlName="asunto"
                  placeholder="Describa brevemente el asunto de la solicitud"
                  [class.is-invalid]="solicitudForm.get('asunto')?.invalid && solicitudForm.get('asunto')?.touched"
                >
                <div class="invalid-feedback" *ngIf="solicitudForm.get('asunto')?.errors?.['required'] && solicitudForm.get('asunto')?.touched">
                  El asunto es obligatorio.
                </div>
                <div class="invalid-feedback" *ngIf="solicitudForm.get('asunto')?.errors?.['minlength'] && solicitudForm.get('asunto')?.touched">
                  El asunto debe tener al menos 5 caracteres.
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-4">
                <label for="descripcion" class="form-label">
                  <i class="bi bi-text-paragraph me-1"></i> Descripción
                </label>
                <textarea
                  class="form-control"
                  id="descripcion"
                  formControlName="descripcion"
                  rows="4"
                  placeholder="Proporcione una descripción detallada de su solicitud"
                  [class.is-invalid]="solicitudForm.get('descripcion')?.invalid && solicitudForm.get('descripcion')?.touched"
                ></textarea>
                <div class="invalid-feedback" *ngIf="solicitudForm.get('descripcion')?.errors?.['required'] && solicitudForm.get('descripcion')?.touched">
                  La descripción es obligatoria.
                </div>
                <div class="invalid-feedback" *ngIf="solicitudForm.get('descripcion')?.errors?.['minlength'] && solicitudForm.get('descripcion')?.touched">
                  La descripción debe tener al menos 10 caracteres.
                </div>
              </div>

              <!-- Prioridad (Radio buttons) -->
              <div class="mb-4">
                <label class="form-label">
                  <i class="bi bi-flag me-1"></i> Prioridad
                </label>
                <div class="priority-group" id="prioridad-group">
                  <label class="priority-option" [class.selected]="solicitudForm.get('prioridad')?.value === 'Alta'">
                    <input type="radio" formControlName="prioridad" value="Alta" class="d-none" id="prioridad-alta">
                    <div class="priority-content alta">
                      <i class="bi bi-arrow-up-circle-fill"></i>
                      <span>Alta</span>
                    </div>
                  </label>
                  <label class="priority-option" [class.selected]="solicitudForm.get('prioridad')?.value === 'Media'">
                    <input type="radio" formControlName="prioridad" value="Media" class="d-none" id="prioridad-media">
                    <div class="priority-content media">
                      <i class="bi bi-dash-circle-fill"></i>
                      <span>Media</span>
                    </div>
                  </label>
                  <label class="priority-option" [class.selected]="solicitudForm.get('prioridad')?.value === 'Baja'">
                    <input type="radio" formControlName="prioridad" value="Baja" class="d-none" id="prioridad-baja">
                    <div class="priority-content baja">
                      <i class="bi bi-arrow-down-circle-fill"></i>
                      <span>Baja</span>
                    </div>
                  </label>
                </div>
                <div class="text-danger mt-1 small" *ngIf="solicitudForm.get('prioridad')?.errors?.['required'] && solicitudForm.get('prioridad')?.touched">
                  Seleccione una prioridad.
                </div>
              </div>

              <!-- Botones -->
              <div class="form-actions">
                <button type="button" class="btn btn-outline-secondary btn-lg" (click)="onReset()" id="reset-btn">
                  <i class="bi bi-arrow-clockwise me-2"></i> Limpiar
                </button>
                <button
                  type="submit"
                  class="btn btn-primary-custom btn-lg"
                  [disabled]="solicitudForm.invalid || isLoading"
                  id="submit-solicitud-btn"
                >
                  <span *ngIf="!isLoading">
                    <i class="bi bi-send me-2"></i> Enviar Solicitud
                  </span>
                  <span *ngIf="isLoading">
                    <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Enviando...
                  </span>
                </button>
              </div>
            </form>
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

    .form-card {
      padding: 32px;
    }

    /* Grupo de prioridad */
    .priority-group {
      display: flex;
      gap: 12px;
    }

    .priority-option {
      flex: 1;
      cursor: pointer;
    }

    .priority-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 10px;
      border: 2px solid #e2e8f0;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .priority-content i {
      font-size: 1.1rem;
    }

    .priority-content.alta { color: #6b7280; }
    .priority-content.media { color: #6b7280; }
    .priority-content.baja { color: #6b7280; }

    .priority-option.selected .priority-content.alta {
      border-color: #dc3545;
      background: #fef2f2;
      color: #dc3545;
      box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
    }

    .priority-option.selected .priority-content.media {
      border-color: #f59e0b;
      background: #fffbeb;
      color: #d97706;
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.15);
    }

    .priority-option.selected .priority-content.baja {
      border-color: #10b981;
      background: #f0fdf4;
      color: #059669;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    .priority-content:hover {
      border-color: #94a3b8;
    }

    /* Botones del form */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
    }

    @media (max-width: 576px) {
      .priority-group {
        flex-direction: column;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions .btn {
        width: 100%;
      }
    }
  `]
})
export class FormularioSolicitudComponent {
  solicitudForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    public authService: AuthService
  ) {
    this.solicitudForm = this.fb.group({
      tipo: ['', [Validators.required]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      prioridad: ['', [Validators.required]]
    });
  }

  /**
   * Envía el formulario para crear una nueva solicitud.
   */
  onSubmit(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.solicitudService.crear(this.solicitudForm.value).subscribe({
      next: (solicitud) => {
        this.isLoading = false;
        this.successMessage = `Solicitud #${solicitud.id} creada exitosamente. Estado: ${solicitud.estado}`;
        this.solicitudForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403) {
          this.errorMessage = 'No tiene permisos para crear solicitudes.';
        } else {
          this.errorMessage = 'Error al crear la solicitud. Intente nuevamente.';
        }
      }
    });
  }

  /**
   * Limpia el formulario.
   */
  onReset(): void {
    this.solicitudForm.reset();
    this.successMessage = '';
    this.errorMessage = '';
  }
}
