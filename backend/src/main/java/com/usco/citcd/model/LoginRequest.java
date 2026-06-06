package com.usco.citcd.model;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO para la solicitud de login.
 */
public class LoginRequest {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    private String username;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    /** Constructor por defecto */
    public LoginRequest() {
    }

    /** Constructor con parámetros */
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // --- Getters y Setters ---

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
