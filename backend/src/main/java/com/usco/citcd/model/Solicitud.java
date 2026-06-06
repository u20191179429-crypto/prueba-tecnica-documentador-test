package com.usco.citcd.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDateTime;

/**
 * Modelo que representa una solicitud en el sistema CITCD.
 */
public class Solicitud {

    private Long id;

    @NotBlank(message = "El tipo de solicitud es obligatorio")
    private String tipo;

    @NotBlank(message = "El asunto es obligatorio")
    private String asunto;

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    @NotBlank(message = "La prioridad es obligatoria")
    @Pattern(regexp = "Alta|Media|Baja", message = "La prioridad debe ser Alta, Media o Baja")
    private String prioridad;

    private String estado;

    private LocalDateTime fechaCreacion;

    /** Constructor por defecto */
    public Solicitud() {
        this.estado = "Pendiente";
        this.fechaCreacion = LocalDateTime.now();
    }

    /** Constructor completo */
    public Solicitud(Long id, String tipo, String asunto, String descripcion, String prioridad, String estado, LocalDateTime fechaCreacion) {
        this.id = id;
        this.tipo = tipo;
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    @Override
    public String toString() {
        return "Solicitud{" +
                "id=" + id +
                ", tipo='" + tipo + '\'' +
                ", asunto='" + asunto + '\'' +
                ", prioridad='" + prioridad + '\'' +
                ", estado='" + estado + '\'' +
                ", fechaCreacion=" + fechaCreacion +
                '}';
    }
}
