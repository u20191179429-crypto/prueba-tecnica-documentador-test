package com.usco.citcd.service;

import com.usco.citcd.model.Solicitud;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SolicitudServiceTest {

    private SolicitudService solicitudService;

    @BeforeEach
    void setUp() {
        // Inicializamos un servicio real antes de cada prueba.
        // Su constructor automáticamente cargará las 4 solicitudes base.
        solicitudService = new SolicitudService();
    }

    // --- PRUEBAS PARA LISTAR TODAS ---

    @Test
    void listarTodas_DebeRetornarLasCuatroSolicitudesBase() {
        // Act
        List<Solicitud> resultado = solicitudService.listarTodas();

        // Assert
        assertNotNull(resultado);
        assertEquals(4, resultado.size(), "Debería iniciar exactamente con 4 solicitudes pre-cargadas");
    }

    @Test
    void listarTodas_DespuesDeCrearNueva_DebeAumentarTamanio() {
        // Arrange: Creamos una nueva solicitud
        Solicitud nueva = new Solicitud();
        nueva.setTipo("Otro");
        nueva.setAsunto("Asunto de prueba");
        nueva.setDescripcion("Descripción de prueba");
        nueva.setPrioridad("Baja");

        // Act
        solicitudService.crear(nueva); // Agregamos una más a la lista
        List<Solicitud> resultado = solicitudService.listarTodas();

        // Assert
        assertEquals(5, resultado.size(), "El tamaño de la lista debería ser 5 tras agregar una solicitud");
        // Verificamos que el último elemento es el que acabamos de insertar
        assertEquals("Otro", resultado.get(4).getTipo());
        assertEquals("Pendiente", resultado.get(4).getEstado()); // Estado asignado por defecto en el método crear
    }

    // --- PRUEBAS PARA FILTRAR POR ESTADO ---

    @Test
    void filtrarPorEstado_Pendiente_DebeRetornarDosSolicitudes() {
        // Act
        List<Solicitud> resultado = solicitudService.filtrarPorEstado("Pendiente");

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size(), "Debería haber 2 solicitudes en estado Pendiente en la base");
        assertTrue(resultado.stream().allMatch(s -> s.getEstado().equals("Pendiente")),
                "Todos los elementos deben ser Pendientes");
    }

    @Test
    void filtrarPorEstado_Procesado_DebeRetornarDosSolicitudes() {
        // Act
        List<Solicitud> resultado = solicitudService.filtrarPorEstado("Procesado");

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size(), "Debería haber 2 solicitudes en estado Procesado en la base");
        assertTrue(resultado.stream().allMatch(s -> s.getEstado().equals("Procesado")),
                "Todos los elementos deben ser Procesados");
    }

    @Test
    void filtrarPorEstado_IgnoraMayusculasYMinusculas() {
        // Act: Probamos enviando el estado con minúsculas y mayúsculas mezcladas
        // El servicio usa equalsIgnoreCase, así que debe funcionar
        List<Solicitud> resultado = solicitudService.filtrarPorEstado("pEnDiEnTe");

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size(), "El filtro debe ignorar mayúsculas y minúsculas");
    }

    @Test
    void filtrarPorEstado_EstadoInexistente_DebeRetornarListaVacia() {
        // Act: Buscamos un estado que no está contemplado
        List<Solicitud> resultado = solicitudService.filtrarPorEstado("Rechazado");

        // Assert
        assertNotNull(resultado);
        assertTrue(resultado.isEmpty(), "La lista debería estar vacía para un estado inexistente");
    }
}