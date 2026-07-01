package com.mgks.peru.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${app.cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/tareas-operativas/asignar", "/api/tareas-operativas/revision", "/api/tareas-operativas/*/resolver").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers("/api/tareas-operativas/trabajador/**", "/api/tareas-operativas/*/subir-evidencia").hasAnyAuthority("TRABAJADOR", "ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers(HttpMethod.POST, "/api/usuarios/**").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/usuarios/**").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/usuarios/**").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/usuarios/**").hasAnyAuthority("TRABAJADOR", "ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers("/api/empresas/**").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .requestMatchers("/api/administradores/**").hasAnyAuthority("ADMINISTRADOR", "SUPERADMINISTRADOR")
                .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}