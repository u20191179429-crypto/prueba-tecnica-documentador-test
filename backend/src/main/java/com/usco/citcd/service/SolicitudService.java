package com.usco.citcd.service;

import com.usco.citcd.model.Solicitud;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de solicitudes.
 * Utiliza almacenamiento in-memory con una lista estática.
 * No requiere base de datos externa.
 */
@Service
public class SolicitudService {

    /** Lista estática que simula la base de datos */
    private final List<Solicitud> solicitudes = Collections.synchronizedList(new ArrayList<>());

    /** Generador de IDs autoincremental */
    private final AtomicLong idGenerator = new AtomicLong(1);

    /**
     * Constructor que inicializa datos de ejemplo para facilitar las pruebas.
     */
    public SolicitudService() {
        // Datos de ejemplo pre-cargados
        solicitudes.add(new Solicitud(
                idGenerator.getAndIncrement(),
                "Certificado",
                "Certificado de notas del semestre 2025-1",
                "Solicito un certificado de notas del primer semestre de 2025 para trámites laborales.",
                "Alta",
                "Pendiente",
                LocalDateTime.of(2025, 6, 1, 10, 30, 0)
        ));

        solicitudes.add(new Solicitud(
                idGenerator.getAndIncrement(),
                "Constancia",
                "Constancia de matrícula activa",
                "Requiero una constancia de matrícula activa para presentar ante la EPS.",
                "Media",
                "Procesado",
                LocalDateTime.of(2025, 6, 2, 14, 15, 0)
        ));

        solicitudes.add(new Solicitud(
                idGenerator.getAndIncrement(),
                "Petición",
                "Cambio de horario en Ingeniería de Software",
                "Solicito cambio de horario de la asignatura Ingeniería de Software por cruce con otra materia.",
                "Alta",
                "Pendiente",
                LocalDateTime.of(2025, 6, 3, 9, 0, 0)
        ));

        solicitudes.add(new Solicitud(
                idGenerator.getAndIncrement(),
                "Queja",
                "Problemas con la plataforma virtual",
                "La plataforma virtual presenta fallas constantes durante las evaluaciones en línea.",
                "Baja",
                "Procesado",
                LocalDateTime.of(2025, 6, 4, 16, 45, 0)
        ));
    }

    /**
     * Crea una nueva solicitud y la almacena en memoria.
     *
     * @param solicitud datos de la solicitud a crear
     * @return la solicitud creada con ID y fecha asignados
     */
    public Solicitud crear(Solicitud solicitud) {
        solicitud.setId(idGenerator.getAndIncrement());
        solicitud.setEstado("Pendiente");
        solicitud.setFechaCreacion(LocalDateTime.now());
        solicitudes.add(solicitud);
        return solicitud;
    }

    /**
     * Retorna todas las solicitudes almacenadas.
     *
     * @return lista de todas las solicitudes
     */
    public List<Solicitud> listarTodas() {
        return new ArrayList<>(solicitudes);
    }

    /**
     * Filtra las solicitudes por estado.
     *
     * @param estado el estado a filtrar (Pendiente o Procesado)
     * @return lista de solicitudes que coinciden con el estado
     */
    public List<Solicitud> filtrarPorEstado(String estado) {
        return solicitudes.stream()
                .filter(s -> s.getEstado().equalsIgnoreCase(estado))
                .collect(Collectors.toList());
    }
}
