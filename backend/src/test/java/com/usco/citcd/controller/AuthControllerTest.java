package com.usco.citcd.controller;

import com.usco.citcd.model.LoginRequest;
import com.usco.citcd.model.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

        @Mock
        private AuthenticationManager authenticationManager;

        @InjectMocks
        private AuthController authController;

        @Test
        void loginConRolAdmin() {

                LoginRequest request = new LoginRequest();
                request.setUsername("admin");
                request.setPassword("admin123");

                Authentication auth = mock(Authentication.class);

                doReturn(List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
                                .when(auth).getAuthorities();

                when(authenticationManager.authenticate(any()))
                                .thenReturn(auth);

                ResponseEntity<?> response = authController.login(request);

                assertEquals(200, response.getStatusCode().value());
                Usuario usuario = (Usuario) response.getBody();
                assertNotNull(usuario);
                assertEquals("ADMIN", usuario.getRol());
        }

        @Test
        void loginConRolDocente() {

                LoginRequest request = new LoginRequest();
                request.setUsername("docente");
                request.setPassword("docente123");

                Authentication auth = mock(Authentication.class);

                doReturn(List.of(new SimpleGrantedAuthority("ROLE_DOCENTE")))
                                .when(auth).getAuthorities();

                when(authenticationManager.authenticate(any()))
                                .thenReturn(auth);

                ResponseEntity<?> response = authController.login(request);

                assertEquals(200, response.getStatusCode().value());
                Usuario usuario = (Usuario) response.getBody();
                assertNotNull(usuario);
                assertEquals("DOCENTE", usuario.getRol());
        }

        @Test
        void loginConRolEstudiante() {

                LoginRequest request = new LoginRequest();
                request.setUsername("estudiante");
                request.setPassword("estudiante123");

                Authentication auth = mock(Authentication.class);

                doReturn(List.of(new SimpleGrantedAuthority("ROLE_ESTUDIANTE")))
                                .when(auth).getAuthorities();

                when(authenticationManager.authenticate(any()))
                                .thenReturn(auth);

                ResponseEntity<?> response = authController.login(request);

                assertEquals(200, response.getStatusCode().value());
                Usuario usuario = (Usuario) response.getBody();
                assertNotNull(usuario);
                assertEquals("ESTUDIANTE", usuario.getRol());
        }

        @Test
        void loginFallido() {
                LoginRequest request = new LoginRequest();
                request.setUsername("admin");
                request.setPassword("Incorrecto123");

                // Simular error
                when(authenticationManager.authenticate(any()))
                                .thenThrow(new BadCredentialsException("Error"));

                ResponseEntity<?> response = authController.login(request);

                assertEquals(401, response.getStatusCode().value());
                assertTrue(response.getBody().toString().contains("Credenciales inválidas"));
        }

        @Test
        void loginUsuarioVacio() {

                LoginRequest request = new LoginRequest();
                request.setUsername("");
                request.setPassword("123");

                when(authenticationManager.authenticate(any()))
                                .thenThrow(new BadCredentialsException("Error"));

                ResponseEntity<?> response = authController.login(request);

                assertEquals(401, response.getStatusCode().value());
        }

        @Test
        void loginContrasenaVacia() {

                LoginRequest request = new LoginRequest();
                request.setUsername("admin");
                request.setPassword("");

                when(authenticationManager.authenticate(any()))
                                .thenThrow(new BadCredentialsException("Error"));

                ResponseEntity<?> response = authController.login(request);

                assertEquals(401, response.getStatusCode().value());
        }

        @Test
        void loginAmbosVacios() {

                LoginRequest request = new LoginRequest();
                request.setUsername("");
                request.setPassword("");

                when(authenticationManager.authenticate(any()))
                                .thenThrow(new BadCredentialsException("Error"));

                ResponseEntity<?> response = authController.login(request);

                assertEquals(401, response.getStatusCode().value());
        }

        @Test
        void loginUsuarioInexistente() {

                LoginRequest request = new LoginRequest();
                request.setUsername("noexiste");
                request.setPassword("1234");

                when(authenticationManager.authenticate(any()))
                                .thenThrow(new BadCredentialsException("Usuario no encontrado"));

                ResponseEntity<?> response = authController.login(request);

                assertEquals(401, response.getStatusCode().value());
        }

}
