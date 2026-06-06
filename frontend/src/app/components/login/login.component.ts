import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de Login.
 * Formulario de autenticación con validaciones reactivas.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <!-- Panel decorativo lateral -->
      <div class="login-side-panel">
        <div class="side-content">
          <div class="logo-container">
            <i class="bi bi-mortarboard-fill logo-icon"></i>
          </div>
          <h1 class="side-title">Universidad Surcolombiana</h1>
          <p class="side-subtitle">Centro de Investigación y Transferencia de Conocimiento y Desarrollo</p>
          <div class="side-features">
            <div class="feature-item">
              <i class="bi bi-shield-check"></i>
              <span>Gestión segura</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-lightning-charge"></i>
              <span>Respuestas rápidas</span>
            </div>
            <div class="feature-item">
              <i class="bi bi-graph-up-arrow"></i>
              <span>Seguimiento en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de login -->
      <div class="login-form-panel">
        <div class="form-container animate-fade-in-up">
          <div class="form-header">
            <h2 class="form-title">Iniciar Sesión</h2>
            <p class="form-subtitle">Accede al Sistema de Gestión de Solicitudes</p>
          </div>

          <!-- Alerta de error -->
          <div *ngIf="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert" id="login-error-alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ errorMessage }}
            <button type="button" class="btn-close" (click)="errorMessage = ''" aria-label="Cerrar"></button>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" id="login-form">
            <!-- Usuario -->
            <div class="mb-4">
              <label for="username" class="form-label">
                <i class="bi bi-person-fill me-1"></i> Usuario
              </label>
              <input
                type="text"
                class="form-control form-control-lg"
                id="username"
                formControlName="username"
                placeholder="Ingresa tu usuario"
                [class.is-invalid]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
              >
              <div class="invalid-feedback" *ngIf="loginForm.get('username')?.errors?.['required'] && loginForm.get('username')?.touched">
                El usuario es obligatorio.
              </div>
            </div>

            <!-- Contraseña -->
            <div class="mb-4">
              <label for="password" class="form-label">
                <i class="bi bi-lock-fill me-1"></i> Contraseña
              </label>
              <div class="input-group">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  class="form-control form-control-lg"
                  id="password"
                  formControlName="password"
                  placeholder="Ingresa tu contraseña"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  id="toggle-password"
                  (click)="showPassword = !showPassword"
                >
                  <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div class="invalid-feedback d-block" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
                La contraseña es obligatoria.
              </div>
            </div>

            <!-- Botón submit -->
            <button
              type="submit"
              class="btn btn-primary-custom w-100 btn-lg"
              id="login-submit-btn"
              [disabled]="loginForm.invalid || isLoading"
            >
              <span *ngIf="!isLoading">
                <i class="bi bi-box-arrow-in-right me-2"></i> Ingresar
              </span>
              <span *ngIf="isLoading">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Validando...
              </span>
            </button>
          </form>

          <!-- Credenciales de prueba -->
          <div class="test-credentials mt-4">
            <p class="credentials-title">
              <i class="bi bi-info-circle me-1"></i> Credenciales de prueba
            </p>
            <div class="credentials-grid">
              <div class="credential-item" (click)="fillCredentials('admin', 'admin123')">
                <span class="cred-role admin">Admin</span>
                <span class="cred-user">admin / admin123</span>
              </div>
              <div class="credential-item" (click)="fillCredentials('docente', 'docente123')">
                <span class="cred-role docente">Docente</span>
                <span class="cred-user">docente / docente123</span>
              </div>
              <div class="credential-item" (click)="fillCredentials('estudiante', 'estudiante123')">
                <span class="cred-role estudiante">Estudiante</span>
                <span class="cred-user">estudiante / estudiante123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      min-height: 100vh;
    }

    /* Panel lateral decorativo */
    .login-side-panel {
      flex: 0 0 42%;
      background: linear-gradient(135deg, #0f2440 0%, #1a3a5c 40%, #2a5a8c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;
      overflow: hidden;
    }

    .login-side-panel::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(232, 168, 56, 0.1) 0%, transparent 70%);
      animation: rotate 20s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .side-content {
      position: relative;
      z-index: 1;
      text-align: center;
      color: white;
    }

    .logo-container {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, var(--accent), var(--accent-light));
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 28px;
      box-shadow: 0 10px 30px rgba(232, 168, 56, 0.3);
    }

    .logo-icon {
      font-size: 2.8rem;
      color: #1a3a5c;
    }

    .side-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }

    .side-subtitle {
      font-size: 0.95rem;
      opacity: 0.8;
      max-width: 300px;
      margin: 0 auto 40px;
      line-height: 1.5;
    }

    .side-features {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      font-size: 0.9rem;
      transition: var(--transition-base);
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateX(5px);
    }

    .feature-item i {
      font-size: 1.2rem;
      color: var(--accent);
    }

    /* Panel de formulario */
    .login-form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-main);
    }

    .form-container {
      width: 100%;
      max-width: 440px;
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
    }

    .form-control-lg {
      padding: 12px 16px;
      font-size: 1rem;
      border-radius: var(--radius-sm);
      border: 1.5px solid #e2e8f0;
    }

    /* Credenciales de prueba */
    .test-credentials {
      background: rgba(26, 58, 92, 0.04);
      border-radius: var(--radius-md);
      padding: 16px;
      border: 1px dashed #cbd5e1;
    }

    .credentials-title {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .credentials-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .credential-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition-fast);
    }

    .credential-item:hover {
      background: rgba(26, 58, 92, 0.08);
    }

    .cred-role {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 10px;
      border-radius: 20px;
      min-width: 80px;
      text-align: center;
    }

    .cred-role.admin { background: #dbeafe; color: #1e40af; }
    .cred-role.docente { background: #fef3c7; color: #92400e; }
    .cred-role.estudiante { background: #d1fae5; color: #065f46; }

    .cred-user {
      font-size: 0.85rem;
      color: var(--text-secondary);
      font-family: monospace;
    }

    /* Responsivo */
    @media (max-width: 992px) {
      .login-side-panel {
        display: none;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  /**
   * Envía el formulario de login.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (usuario) => {
        this.isLoading = false;
        // Redirigir según rol
        if (usuario.rol === 'ADMIN') {
          this.router.navigate(['/solicitudes']);
        } else {
          this.router.navigate(['/solicitudes/nueva']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas. Verifica tu usuario y contraseña.';
        } else {
          this.errorMessage = 'Error de conexión. Verifica que el servidor esté activo.';
        }
      }
    });
  }

  /**
   * Rellena las credenciales de prueba al hacer clic.
   */
  fillCredentials(username: string, password: string): void {
    this.loginForm.patchValue({ username, password });
  }
}
