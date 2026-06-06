package com.usco.citcd.model;

/**
 * DTO que representa la respuesta de autenticación con los datos del usuario.
 */
public class Usuario {

    private String username;
    private String rol;

    /** Constructor por defecto */
    public Usuario() {
    }

    /** Constructor con parámetros */
    public Usuario(String username, String rol) {
        this.username = username;
        this.rol = rol;
    }

    // --- Getters y Setters ---

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
