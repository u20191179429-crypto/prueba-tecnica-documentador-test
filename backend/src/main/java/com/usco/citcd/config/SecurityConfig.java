package com.usco.citcd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de seguridad del sistema.
 * Define usuarios in-memory, Basic Auth y autorización por roles.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Codificador de contraseñas BCrypt.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Usuarios predefinidos almacenados en memoria.
     * - admin / admin123 (Rol: ADMIN)
     * - docente / docente123 (Rol: DOCENTE)
     * - estudiante / estudiante123 (Rol: ESTUDIANTE)
     */
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .roles("ADMIN")
                .build();

        UserDetails docente = User.builder()
                .username("docente")
                .password(passwordEncoder.encode("docente123"))
                .roles("DOCENTE")
                .build();

        UserDetails estudiante = User.builder()
                .username("estudiante")
                .password(passwordEncoder.encode("estudiante123"))
                .roles("ESTUDIANTE")
                .build();

        return new InMemoryUserDetailsManager(admin, docente, estudiante);
    }

    /**
     * AuthenticationManager necesario para el endpoint de login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Cadena de filtros de seguridad.
     * Configura Basic Auth, CORS, CSRF deshabilitado y autorización por endpoints.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .httpBasic(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Login público (sin autenticación previa en el header)
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()

                        // GET /api/solicitudes — Solo ADMIN puede listar todas
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes").hasRole("ADMIN")

                        // GET /api/solicitudes/estado/{estado} — ADMIN y DOCENTE
                        .requestMatchers(HttpMethod.GET, "/api/solicitudes/estado/**").hasAnyRole("ADMIN", "DOCENTE")

                        // POST /api/solicitudes — Todos los roles autenticados
                        .requestMatchers(HttpMethod.POST, "/api/solicitudes").authenticated()

                        // Cualquier otra solicitud requiere autenticación
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    /**
     * Configuración de CORS para permitir peticiones desde Angular (localhost:4200).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
