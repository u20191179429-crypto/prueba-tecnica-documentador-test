import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        // 1. Creamos los espías (mocks) para las dependencias
        const authSpy = jasmine.createSpyObj('AuthService', ['login']);
        const navSpy = jasmine.createSpyObj('Router', ['navigate']);

        // 2. Configuramos el módulo de pruebas
        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule], // Al ser standalone, lo importamos aquí
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: navSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;

        // Obtenemos las referencias a los espías para usarlos en las pruebas
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        fixture.detectChanges(); // Ejecuta ngOnInit y ciclo de vida inicial
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    // --- PRUEBAS DE FORMULARIO (Validaciones) ---

    it('debe inicializar el formulario inválido si está vacío', () => {
        expect(component.loginForm.valid).toBeFalse();
        expect(component.loginForm.get('username')?.errors?.['required']).toBeTruthy();
        expect(component.loginForm.get('password')?.errors?.['required']).toBeTruthy();
    });

    it('debe habilitar el botón submit y ser válido cuando los campos estén llenos', () => {
        // Arrange
        component.loginForm.patchValue({
            username: 'admin',
            password: 'admin123'
        });
        fixture.detectChanges();

        // Assert
        expect(component.loginForm.valid).toBeTrue();
        const submitBtn = fixture.debugElement.query(By.css('#login-submit-btn')).nativeElement;
        expect(submitBtn.disabled).toBeFalse();
    });

    it('debe mostrar mensaje de validación si se toca el input vacío', () => {
        // Obtenemos el control del usuario y lo marcamos como tocado
        const usernameControl = component.loginForm.get('username');
        usernameControl?.markAsTouched();
        fixture.detectChanges(); // Actualizamos la vista

        // Buscamos el mensaje de error en el DOM
        const errorDiv = fixture.debugElement.query(By.css('.invalid-feedback'));
        expect(errorDiv).toBeTruthy();
        expect(errorDiv.nativeElement.textContent).toContain('El usuario es obligatorio');
    });

    // --- PRUEBAS DE LOGICA DE NEGOCIO (AuthService y Rutas) ---

    it('no debe llamar al AuthService si el formulario es inválido', () => {
        // Intentamos hacer submit con el formulario vacío
        component.onSubmit();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('debe llamar al AuthService y redirigir a /solicitudes si es ADMIN', fakeAsync(() => {
        // Arrange
        const mockUsuarioAdmin = { username: 'admin', rol: 'ADMIN' };
        authServiceSpy.login.and.returnValue(of(mockUsuarioAdmin)); // Simulamos respuesta exitosa

        component.loginForm.patchValue({
            username: 'admin',
            password: 'admin123'
        });

        // Act
        component.onSubmit();
        tick(); // Esperamos que se resuelva el observable

        // Assert
        expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'admin', password: 'admin123' });
        expect(component.isLoading).toBeFalse();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/solicitudes']);
    }));

    it('debe llamar al AuthService y redirigir a /solicitudes/nueva si NO es ADMIN (ej. DOCENTE)', fakeAsync(() => {
        // Arrange
        const mockUsuarioDocente = { username: 'docente', rol: 'DOCENTE' };
        authServiceSpy.login.and.returnValue(of(mockUsuarioDocente));

        component.loginForm.patchValue({
            username: 'docente',
            password: 'docente123'
        });

        // Act
        component.onSubmit();
        tick();

        // Assert
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/solicitudes/nueva']);
    }));

    it('debe mostrar mensaje de error 401 si las credenciales son inválidas', fakeAsync(() => {
        // Arrange
        const errorResponse = { status: 401 };
        authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

        component.loginForm.patchValue({
            username: 'userX',
            password: 'wrongpassword'
        });

        // Act
        component.onSubmit();
        tick();
        fixture.detectChanges(); // Actualizamos la vista para que aparezca el alert

        // Assert
        expect(component.isLoading).toBeFalse();
        expect(component.errorMessage).toBe('Credenciales inválidas. Verifica tu usuario y contraseña.');

        // Verificamos que el alert aparece en el DOM
        const errorAlert = fixture.debugElement.query(By.css('#login-error-alert'));
        expect(errorAlert).toBeTruthy();
        expect(errorAlert.nativeElement.textContent).toContain('Credenciales inválidas');
    }));

    // --- PRUEBA DE FUNCIONALIDAD UI (Métodos auxiliares) ---

    it('debe rellenar el formulario al usar el método fillCredentials()', () => {
        // Act
        component.fillCredentials('estudiante', 'estudiante123');

        // Assert
        expect(component.loginForm.get('username')?.value).toBe('estudiante');
        expect(component.loginForm.get('password')?.value).toBe('estudiante123');
        expect(component.loginForm.valid).toBeTrue();
    });
});