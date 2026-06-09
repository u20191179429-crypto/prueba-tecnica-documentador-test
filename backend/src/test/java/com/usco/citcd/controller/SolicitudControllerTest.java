package com.usco.citcd.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.usco.citcd.model.Solicitud;
import com.usco.citcd.service.SolicitudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SolicitudControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SolicitudService solicitudService;

    @InjectMocks
    private SolicitudController solicitudController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        LocalValidatorFactoryBean validator = new LocalValidatorFactoryBean();
        validator.afterPropertiesSet();

        mockMvc = MockMvcBuilders.standaloneSetup(solicitudController)
                .setValidator(validator)
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    // --- PRUEBAS POSITIVAS (Combinaciones Exhaustivas) ---

    @ParameterizedTest
    @CsvSource({
            "Certificado, Alta", "Certificado, Media", "Certificado, Baja",
            "Constancia, Alta", "Constancia, Media", "Constancia, Baja",
            "Petición, Alta", "Petición, Media", "Petición, Baja",
            "Queja, Alta", "Queja, Media", "Queja, Baja",
            "Otro, Alta", "Otro, Media", "Otro, Baja"
    })
    void crearSolicitud_CombinacionesValidas_RetornaCreated(String tipo, String prioridad) throws Exception {
        // Arrange
        Solicitud request = new Solicitud();
        request.setTipo(tipo);
        request.setAsunto("Asunto de prueba genérico");
        request.setDescripcion("Descripción detallada para la prueba automatizada.");
        request.setPrioridad(prioridad);

        Solicitud respuestaEsperada = new Solicitud();
        respuestaEsperada.setId(1L);
        respuestaEsperada.setTipo(tipo);
        respuestaEsperada.setAsunto("Asunto de prueba genérico");
        respuestaEsperada.setDescripcion("Descripción detallada para la prueba automatizada.");
        respuestaEsperada.setPrioridad(prioridad);
        respuestaEsperada.setFechaCreacion(LocalDateTime.now());

        // Usamos una respuesta dinámica basada en los parámetros
        when(solicitudService.crear(any(Solicitud.class))).thenReturn(respuestaEsperada);

        // Act & Assert
        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.tipo").value(tipo))
                .andExpect(jsonPath("$.prioridad").value(prioridad));
    }

    // --- PRUEBAS NEGATIVAS (Validación de campos vacíos/nulos) ---

    @Test
    void crearSolicitud_TipoVacio_RetornaBadRequest() throws Exception {
        Solicitud request = crearSolicitudBase();
        request.setTipo(""); // Simulando la opción "-- Seleccione un tipo --"

        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearSolicitud_AsuntoVacio_RetornaBadRequest() throws Exception {
        Solicitud request = crearSolicitudBase();
        request.setAsunto("");

        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearSolicitud_DescripcionVacia_RetornaBadRequest() throws Exception {
        Solicitud request = crearSolicitudBase();
        request.setDescripcion("");

        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearSolicitud_PrioridadVacia_RetornaBadRequest() throws Exception {
        Solicitud request = crearSolicitudBase();
        request.setPrioridad(null); // O "", dependiendo de cómo lo envíe el frontend si no se selecciona nada

        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void crearSolicitud_TodosLosCamposVacios_RetornaBadRequest() throws Exception {
        Solicitud request = new Solicitud(); // Objeto completamente vacío
        request.setTipo("");
        request.setAsunto("");
        request.setDescripcion("");
        request.setPrioridad("");

        mockMvc.perform(post("/api/solicitudes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // --- MÉTODOS AUXILIARES ---

    /**
     * Método de ayuda para crear un objeto válido y evitar código repetitivo en las
     * pruebas negativas.
     */
    private Solicitud crearSolicitudBase() {
        Solicitud request = new Solicitud();
        request.setTipo("Certificado");
        request.setAsunto("Asunto válido");
        request.setDescripcion("Descripción válida");
        request.setPrioridad("Alta");
        return request;
    }
}