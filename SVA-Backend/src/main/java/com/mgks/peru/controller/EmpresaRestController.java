package com.mgks.peru.controller;

import com.mgks.peru.model.Cliente;
import com.mgks.peru.model.Sucursal;
import com.mgks.peru.repository.ClienteRepository;
import com.mgks.peru.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaRestController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    @GetMapping
    public List<Cliente> listarTodo() {
        return clienteRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<String> registrarCliente(@RequestBody Cliente cliente) {
        if (clienteRepository.findByRuc(cliente.getRuc()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: El RUC " + cliente.getRuc() + " ya está registrado.");
        }

        if (cliente.getSucursales() != null) {
            for (Sucursal sucursal : cliente.getSucursales()) {
                sucursal.setCliente(cliente);
            }
        }

        clienteRepository.save(cliente);
        return ResponseEntity.ok("Cliente corporativo '" + cliente.getRazonSocial() + "' registrado con éxito.");
    }

    @PostMapping("/{clienteId}/sucursales")
    public ResponseEntity<String> agregarSucursal(@PathVariable Long clienteId, @RequestBody Sucursal nuevaSucursal) {
        return clienteRepository.findById(clienteId).map(cliente -> {
            nuevaSucursal.setCliente(cliente);
            sucursalRepository.save(nuevaSucursal);
            return ResponseEntity.ok("Sucursal '" + nuevaSucursal.getNombreSucursal() + "' agregada correctamente a " + cliente.getRazonSocial());
        }).orElse(ResponseEntity.status(404).body("Error: No se encontró el cliente corporativo con ID: " + clienteId));
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarCliente(@PathVariable Long id) {
        if (!clienteRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: No se encontró el cliente corporativo con ID: " + id);
        }
        try {
            clienteRepository.deleteById(id);
            return ResponseEntity.ok("Cliente corporativo eliminado correctamente del sistema MGKS.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al intentar eliminar la empresa corporativa.");
        }
    }

    @DeleteMapping("/sucursales/eliminar/{id}")
    public ResponseEntity<String> eliminarSucursal(@PathVariable Long id) {
        if (!sucursalRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: No se encontró la sucursal con ID: " + id);
        }
        try {
            sucursalRepository.deleteById(id);
            return ResponseEntity.ok("Sucursal removida con éxito.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se pudo eliminar la sucursal.");
        }
    }
}