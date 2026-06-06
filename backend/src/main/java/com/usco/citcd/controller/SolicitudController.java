package com.usco.citcd.controller;

import com.usco.citcd.model.Solicitud;
import com.usco.citcd.service.SolicitudService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador REST para la gestión de solicitudes.
 */
@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    /**
     * Crea una nueva solicitud.
     * Acceso: todos los roles autenticados.
     *
     * @param solicitud datos de la solicitud a crear
     * @return la solicitud creada con código 201
     */
    @PostMapping
    public ResponseEntity<Solicitud> crear(@Valid @RequestBody Solicitud solicitud) {
        Solicitud nuevaSolicitud = solicitudService.crear(solicitud);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaSolicitud);
    }

    /**
     * Lista todas las solicitudes.
     * Acceso: solo ADMIN.
     *
     * @return lista de todas las solicitudes
     */
    @GetMapping
    public ResponseEntity<List<Solicitud>> listarTodas() {
        List<Solicitud> solicitudes = solicitudService.listarTodas();
        return ResponseEntity.ok(solicitudes);
    }

    /**
     * Filtra solicitudes por estado.
     * Acceso: ADMIN y DOCENTE.
     *
     * @param estado el estado a filtrar (Pendiente o Procesado)
     * @return lista de solicitudes filtradas
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Solicitud>> filtrarPorEstado(@PathVariable String estado) {
        List<Solicitud> solicitudes = solicitudService.filtrarPorEstado(estado);
        return ResponseEntity.ok(solicitudes);
    }
}
