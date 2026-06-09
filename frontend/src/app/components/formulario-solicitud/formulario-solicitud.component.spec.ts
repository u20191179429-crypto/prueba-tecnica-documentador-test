import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormularioSolicitudComponent } from './formulario-solicitud.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudService } from '../../services/solicitud.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('FormularioSolicitudComponent', () => {
    let component: FormularioSolicitudComponent;
    let fixture: ComponentFixture<FormularioSolicitudComponent>;
    let solicitudServiceSpy: jasmine.SpyObj<SolicitudService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        // 1. Creamos espías para los servicios
        const solSpy = jasmine.createSpyObj('SolicitudService', ['crear']);
        const authSpy = jasmine.createSpyObj('AuthService', [], { currentUser: { rol: 'ESTUDIANTE' } });

        // 2. Configuramos TestBed
        await TestBed.configureTestingModule({
            imports: [FormularioSolicitudComponent, ReactiveFormsModule],
            providers: [
                { provide: SolicitudService, useValue: solSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FormularioSolicitudComponent);
        component = fixture.componentInstance;

        solicitudServiceSpy = TestBed.inject(SolicitudService) as jasmine.SpyObj<SolicitudService>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

        fixture.detectChanges();
    });

    it('debe crear el componente', () => {
        expect(component).toBeTruthy();
    });

    // --- PRUEBAS DE FORMULARIO (Validaciones) ---

    it('debe marcar el formulario como inválido al inicio', () => {
        expect(component.solicitudForm.valid).toBeFalse();
    });

    it('debe validar la longitud mínima del asunto (5 caracteres)', () => {
        const asuntoControl = component.solicitudForm.get('asunto');

        asuntoControl?.setValue('abc'); // Menos de 5
        expect(asuntoControl?.errors?.['minlength']).toBeTruthy();

        asuntoControl?.setValue('Asunto válido'); // Más de 5
        expect(asuntoControl?.errors?.['minlength']).toBeFalsy();
    });

    it('debe validar la longitud mínima de la descripción (10 caracteres)', () => {
        const descControl = component.solicitudForm.get('descripcion');

        descControl?.setValue('Corta'); // Menos de 10
        expect(descControl?.errors?.['minlength']).toBeTruthy();

        descControl?.setValue('Descripción suficientemente larga'); // Más de 10
        expect(descControl?.errors?.['minlength']).toBeFalsy();
    });

    it('debe habilitar el botón submit si el formulario es válido', () => {
        // Arrange: llenamos el formulario con datos válidos
        component.solicitudForm.patchValue({
            tipo: 'Certificado',
            asunto: 'Asunto de prueba',
            descripcion: 'Descripción con más de diez caracteres',
            prioridad: 'Alta'
        });
        fixture.detectChanges();

        // Assert
        expect(component.solicitudForm.valid).toBeTrue();
        const submitBtn = fixture.debugElement.query(By.css('#submit-solicitud-btn')).nativeElement;
        expect(submitBtn.disabled).toBeFalse();
    });

    // --- PRUEBAS DE EVENTOS DE USUARIO ---

    it('debe marcar todos los campos como tocados (touched) si se intenta enviar un formulario inválido', () => {
        // Act
        component.onSubmit();

        // Assert
        expect(component.solicitudForm.get('tipo')?.touched).toBeTrue();
        expect(component.solicitudForm.get('asunto')?.touched).toBeTrue();
        expect(solicitudServiceSpy.crear).not.toHaveBeenCalled();
    });

    it('debe limpiar el formulario al presionar el botón Reset', () => {
        // Arrange
        component.solicitudForm.patchValue({ tipo: 'Queja', prioridad: 'Media' });
        component.errorMessage = 'Error previo';

        // Act
        component.onReset();

        // Assert
        expect(component.solicitudForm.get('tipo')?.value).toBeNull(); // El reset lo vuelve null
        expect(component.errorMessage).toBe('');
    });

    // --- PRUEBAS DE LOGICA DE NEGOCIO (Interacción con Servicio) ---

    it('debe llamar a SolicitudService y mostrar mensaje de éxito si la creación es correcta', fakeAsync(() => {
        // Arrange
        const formularioValido = {
            tipo: 'Petición',
            asunto: 'Cambio de horario',
            descripcion: 'Solicito cambio por cruce de materias',
            prioridad: 'Media'
        };

        const respuestaServidor = { id: 99, ...formularioValido, estado: 'Pendiente' };
        solicitudServiceSpy.crear.and.returnValue(of(respuestaServidor));

        component.solicitudForm.setValue(formularioValido);

        // Act
        component.onSubmit();
        tick(); // Esperamos al observable
        fixture.detectChanges(); // Actualizamos la vista para el alert

        // Assert
        expect(solicitudServiceSpy.crear).toHaveBeenCalledWith(formularioValido);
        expect(component.successMessage).toContain('Solicitud #99 creada exitosamente');
        expect(component.isLoading).toBeFalse();

        // Verifica que el alert verde aparezca
        const successAlert = fixture.debugElement.query(By.css('#success-alert'));
        expect(successAlert).toBeTruthy();
    }));

    it('debe mostrar mensaje de error si falla la creación en el servidor', fakeAsync(() => {
        // Arrange
        const formularioValido = {
            tipo: 'Otro',
            asunto: 'Asunto genérico',
            descripcion: 'Descripción genérica válida',
            prioridad: 'Baja'
        };

        solicitudServiceSpy.crear.and.returnValue(throwError(() => ({ status: 500 })));
        component.solicitudForm.setValue(formularioValido);

        // Act
        component.onSubmit();
        tick();
        fixture.detectChanges();

        // Assert
        expect(component.errorMessage).toBe('Error al crear la solicitud. Intente nuevamente.');
        expect(component.isLoading).toBeFalse();

        // Verifica que el alert rojo aparezca
        const errorAlert = fixture.debugElement.query(By.css('#error-alert'));
        expect(errorAlert).toBeTruthy();
    }));
});