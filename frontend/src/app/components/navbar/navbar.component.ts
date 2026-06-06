import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Componente Navbar.
 * Muestra el usuario actual, rol y navegación condicional según permisos.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar-custom" id="main-navbar">
      <div class="container-fluid px-4">
        <div class="navbar-content">
          <!-- Logo y título -->
          <div class="navbar-brand-custom">
            <div class="brand-icon">
              <i class="bi bi-mortarboard-fill"></i>
            </div>
            <div class="brand-text">
              <span class="brand-title">CITCD</span>
              <span class="brand-subtitle">Gestión de Solicitudes</span>
            </div>
          </div>

          <!-- Navegación -->
          <div class="navbar-nav-custom">
            <a
              routerLink="/solicitudes/nueva"
              routerLinkActive="nav-active"
              class="nav-item-custom"
              id="nav-nueva-solicitud"
            >
              <i class="bi bi-plus-circle"></i>
              <span>Nueva Solicitud</span>
            </a>

            <a
              *ngIf="authService.getRol() === 'ADMIN'"
              routerLink="/solicitudes"
              routerLinkActive="nav-active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-item-custom"
              id="nav-lista-solicitudes"
            >
              <i class="bi bi-list-ul"></i>
              <span>Solicitudes</span>
            </a>

            <a
              *ngIf="authService.getRol() === 'ADMIN' || authService.getRol() === 'DOCENTE'"
              routerLink="/solicitudes/filtrar"
              routerLinkActive="nav-active"
              class="nav-item-custom"
              id="nav-filtrar-solicitudes"
            >
              <i class="bi bi-funnel"></i>
              <span>Filtrar</span>
            </a>
          </div>

          <!-- Info usuario -->
          <div class="navbar-user">
            <div class="user-info">
              <div class="user-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <div class="user-details">
                <span class="user-name" id="navbar-username">{{ authService.getUsername() }}</span>
                <span class="user-role" id="navbar-role" [ngClass]="'role-' + authService.getRol().toLowerCase()">
                  {{ authService.getRol() }}
                </span>
              </div>
            </div>
            <button
              class="btn-logout"
              (click)="onLogout()"
              id="logout-btn"
              title="Cerrar sesión"
            >
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar-custom {
      background: linear-gradient(135deg, #0f2440 0%, #1a3a5c 100%);
      padding: 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 64px;
      gap: 24px;
    }

    /* Brand */
    .navbar-brand-custom {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      flex-shrink: 0;
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--accent), var(--accent-light));
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: #1a3a5c;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      color: white;
      font-weight: 800;
      font-size: 1.1rem;
      letter-spacing: 1px;
      line-height: 1.2;
    }

    .brand-subtitle {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.7rem;
      letter-spacing: 0.5px;
    }

    /* Nav items */
    .navbar-nav-custom {
      display: flex;
      gap: 4px;
    }

    .nav-item-custom {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .nav-item-custom:hover {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-item-custom.nav-active {
      color: var(--accent);
      background: rgba(232, 168, 56, 0.15);
      font-weight: 600;
    }

    .nav-item-custom i {
      font-size: 1rem;
    }

    /* User info */
    .navbar-user {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 1rem;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
      line-height: 1.2;
    }

    .user-role {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 1px 8px;
      border-radius: 10px;
      display: inline-block;
      width: fit-content;
    }

    .role-admin { background: #dbeafe; color: #1e40af; }
    .role-docente { background: #fef3c7; color: #92400e; }
    .role-estudiante { background: #d1fae5; color: #065f46; }

    .btn-logout {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.1rem;
    }

    .btn-logout:hover {
      background: rgba(220, 53, 69, 0.8);
      border-color: transparent;
      color: white;
    }

    @media (max-width: 768px) {
      .navbar-content {
        flex-wrap: wrap;
        padding: 10px 0;
        gap: 10px;
      }

      .navbar-nav-custom {
        order: 3;
        width: 100%;
        justify-content: center;
      }

      .brand-subtitle,
      .user-details {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  /**
   * Cierra la sesión y redirige al login.
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
