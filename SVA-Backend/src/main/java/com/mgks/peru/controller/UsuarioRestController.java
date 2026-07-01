package com.mgks.peru.controller;

import com.mgks.peru.model.Usuario;
import com.mgks.peru.service.UsuarioService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios") 
public class UsuarioRestController {

    @Autowired
    private UsuarioService trabajadorService;

    @GetMapping
    public List<Usuario> getAll() {
        return trabajadorService.listarTodo();
    }
    
    @GetMapping("/{dni}")
    public ResponseEntity<Usuario> getById(@PathVariable String dni) {
        Usuario trabajador = trabajadorService.buscarPorDni(dni);
        if (trabajador != null) {
            return ResponseEntity.ok(trabajador);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public String save(@RequestBody Usuario nuevoTrabajador) {
        trabajadorService.guardar(nuevoTrabajador);
        return "Trabajador con DNI " + nuevoTrabajador.getDni() + " guardado con éxito";
    }

  
    @PutMapping("/{dni}")
    public ResponseEntity<String> update(@PathVariable String dni, @RequestBody Usuario datosNuevos) {
        try {
            trabajadorService.actualizar(dni, datosNuevos);
            return ResponseEntity.ok("¡Datos actualizados con éxito en el sistema MGKS!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar: " + e.getMessage());
        }
    }
   
    @DeleteMapping("/{dni}")
    public String delete(@PathVariable String dni) {
        boolean eliminado = trabajadorService.eliminar(dni);
        if (eliminado) {
            return "Trabajador con DNI " + dni + " eliminado con éxito";
        } else {
            return "Error: No se encontró trabajador con el DNI " + dni;
        }
    }
}