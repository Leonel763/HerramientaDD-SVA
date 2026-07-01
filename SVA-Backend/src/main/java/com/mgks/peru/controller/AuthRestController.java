package com.mgks.peru.controller;

import com.mgks.peru.dto.LoginRequest;
import com.mgks.peru.model.Usuario;
import com.mgks.peru.repository.UsuarioRepository;
import com.mgks.peru.service.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

            if (passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {

                String token = jwtUtils.generateToken(userDetails.getUsername());
                String authority = userDetails.getAuthorities().iterator().next().getAuthority();
                String cleanRole = authority.replace("ROLE_", "");

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", userDetails.getUsername());
                response.put("role", cleanRole);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no registrado en el sistema: " + e.getMessage());
        }
    }

    @PostMapping("/cambiar-password")
    public ResponseEntity<?> cambiarPassword(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (!passwordEncoder.matches(oldPassword, userDetails.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Contraseña actual incorrecta."));
            }

            Usuario usuario = usuarioRepository.findById(username).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            usuario.setPassword(passwordEncoder.encode(newPassword));
            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("mensaje", "Contraseña validada y actualizada correctamente."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "El DNI no está registrado en el sistema."));
        }
    }
}