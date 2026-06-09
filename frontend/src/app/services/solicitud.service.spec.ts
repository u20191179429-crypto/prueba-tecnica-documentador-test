import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SolicitudService } from './solicitud.service';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Solicitud } from '../models/solicitud.model';

describe('SolicitudService', () => {
    let service: SolicitudService;
    let httpMock: HttpTestingController;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    const API_URL = 'http://localhost:8080/api/solicitudes';

    beforeEach(() => {
        // 1. Creamos el espía para AuthService
        const authSpy = jasmine.createSpyObj('AuthService', ['getAuthHeaders']);

        // Simulamos que el AuthService devuelve unas cabeceras válidas
        const mockHeaders = new HttpHeaders().set('Authorization', 'Basic dXNlcjpwYXNz');
        authSpy.getAuthHeaders.and.returnValue(mockHeaders);

        // 2. Configuramos el módulo de pruebas
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule], // Importante: Módulo para simular HTTP
            providers: [
                SolicitudService,
                { provide: AuthService, useValue: authSpy }
            ]
        });

        // 3. Inyectamos las dependencias
        service = TestBed.inject(SolicitudService);
        httpMock = TestBed.inject(HttpTestingController);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    });

    afterEach(() => {
        // Verificamos que no queden peticiones HTTP pendientes
        httpMock.verify();
    });

    it('debe crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    it('debe crear una nueva solicitud mediante POST e incluir cabeceras de auth', () => {
        // Arrange
        const nuevaSolicitud: Solicitud = {
            tipo: 'Certificado',
            asunto: 'Certificado de notas',
            descripcion: 'Solicito certificado de notas del semestre actual',
            prioridad: 'Alta'
        };

        const respuestaEsperada: Solicitud = {
            id: 1,
            ...nuevaSolicitud,
            estado: 'Pendiente',
            fechaCreacion: new Date().toISOString()
        };

        // Act
        service.crear(nuevaSolicitud).subscribe(respuesta => {
            // Assert sobre la respuesta del observable
            expect(respuesta).toEqual(respuestaEsperada);
            expect(respuesta.id).toBe(1);
        });

        // Assert sobre la petición HTTP
        const req = httpMock.expectOne(API_URL);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(nuevaSolicitud);
        expect(req.request.headers.has('Authorization')).toBeTrue(); // Verifica que se adjuntó la cabecera

        // Verificamos que el AuthService fue consultado
        expect(authServiceSpy.getAuthHeaders).toHaveBeenCalled();

        // Resolvemos la petición con nuestra respuesta simulada
        req.flush(respuestaEsperada);
    });

    it('debe obtener todas las solicitudes mediante GET', () => {
        // Arrange
        const mockSolicitudes: Solicitud[] = [
            { id: 1, tipo: 'Petición', asunto: 'Asunto 1', descripcion: 'Desc 1', prioridad: 'Media', estado: 'Pendiente' },
            { id: 2, tipo: 'Queja', asunto: 'Asunto 2', descripcion: 'Desc 2', prioridad: 'Alta', estado: 'Procesado' }
        ];

        // Act
        service.listarTodas().subscribe(solicitudes => {
            // Assert
            expect(solicitudes.length).toBe(2);
            expect(solicitudes).toEqual(mockSolicitudes);
        });

        // Validamos la petición
        const req = httpMock.expectOne(API_URL);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('Authorization')).toBeTrue();

        req.flush(mockSolicitudes);
    });

    it('debe filtrar las solicitudes por estado mediante GET', () => {
        // Arrange
        const estadoABuscar = 'Procesado';
        const mockSolicitudes: Solicitud[] = [
            { id: 2, tipo: 'Queja', asunto: 'Asunto 2', descripcion: 'Desc 2', prioridad: 'Alta', estado: 'Procesado' }
        ];

        // Act
        service.filtrarPorEstado(estadoABuscar).subscribe(solicitudes => {
            // Assert
            expect(solicitudes.length).toBe(1);
            expect(solicitudes[0].estado).toBe('Procesado');
        });

        // Validamos que la URL contenga el parámetro esperado
        const req = httpMock.expectOne(`${API_URL}/estado/${estadoABuscar}`);
        expect(req.request.method).toBe('GET');
        expect(req.request.headers.has('Authorization')).toBeTrue();

        req.flush(mockSolicitudes);
    });
});