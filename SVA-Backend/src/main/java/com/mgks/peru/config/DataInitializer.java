/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.mgks.peru.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mgks.peru.model.Usuario; 
import com.mgks.peru.repository.UsuarioRepository;


@Component
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository repository, PasswordEncoder encoder) {
        return args -> {
         

            String defaultPasswordEncrypted = encoder.encode("123");

          
            if (!repository.existsById("71156519")) {
                Usuario superAdmin = new Usuario();
                superAdmin.setDni("71156519");
                superAdmin.setNombre("Administrador");
                superAdmin.setApellidos("MGKS");
                superAdmin.setTelefono("922779157");
                superAdmin.setSueldoBase(1200.0);
                superAdmin.setRol("SUPERADMINISTRADOR"); 
                superAdmin.setBanco("BCP");
                superAdmin.setNumeroCuenta("172371283");
                superAdmin.setPassword(defaultPasswordEncrypted); 
                
                repository.save(superAdmin);
                System.out.println("Super Administrador (71156519) creado.");
            } else {
                
                Usuario existente = repository.findById("71156519").get();
                if (!"SUPERADMINISTRADOR".equals(existente.getRol())) {
                    existente.setRol("SUPERADMINISTRADOR");
                    repository.save(existente);
                    System.out.println("[MOD] Rol de 71156519 actualizado a SUPERADMINISTRADOR.");
                }
            }

           
            if (!repository.existsById("11111111")) {
                Usuario adminStandard = new Usuario();
                adminStandard.setDni("11111111");
                adminStandard.setNombre("Carlos Gestor");
                adminStandard.setApellidos("Pérez");
                adminStandard.setTelefono("987654321");
                adminStandard.setSueldoBase(1500.0);
                adminStandard.setRol("ADMINISTRADOR"); 
                adminStandard.setBanco("BBVA");
                adminStandard.setNumeroCuenta("222233334444");
                adminStandard.setPassword(defaultPasswordEncrypted);

                repository.save(adminStandard);
                System.out.println("[OK] Administrador Estándar (11111111) creado.");
            }

          
            if (!repository.existsById("22222222")) {
                Usuario operario = new Usuario();
                operario.setDni("22222222");
                operario.setNombre("Juan Lavador");
                operario.setApellidos("Quispe");
                operario.setTelefono("955444333");
                operario.setSueldoBase(1025.0);
                operario.setRol("TRABAJADOR"); 
                operario.setBanco("YAPE");
                operario.setNumeroCuenta("955444333");
                operario.setPassword(defaultPasswordEncrypted);

                repository.save(operario);
                System.out.println("Operario de Lavado (22222222) creado.");
            }

            
        };
    }
}