package com.mgks.peru.controller;

import com.mgks.peru.dto.EvidenciaRequest;
import com.mgks.peru.model.TareaOperativa;
import com.mgks.peru.service.TareaOperativaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tareas-operativas")
public class TareaOperativaRestController {

    @Autowired
    private TareaOperativaService tareaOperativaService;

    @PostMapping("/asignar")
    public ResponseEntity<TareaOperativa> crear(@RequestBody TareaOperativa tarea) {
        return ResponseEntity.ok(tareaOperativaService.asignarTarea(tarea));
    }

    @GetMapping("/revision")
    public List<TareaOperativa> listarParaRevision(@RequestParam String fecha) {
        return tareaOperativaService.listarPorFecha(LocalDate.parse(fecha));
    }

    @PutMapping("/{id}/resolver")
    public ResponseEntity<TareaOperativa> resolver(
            @PathVariable Long id,
            @RequestParam String estado) {
        return ResponseEntity.ok(tareaOperativaService.resolverTarea(id, estado));
    }

    @GetMapping("/trabajador/{dni}")
    public List<TareaOperativa> listarPorTrabajador(@PathVariable String dni) {
        return tareaOperativaService.listarPorTrabajador(dni);
    }

    @PutMapping("/{id}/subir-evidencia")
    public ResponseEntity<TareaOperativa> entregar(
            @PathVariable Long id,
            @RequestBody EvidenciaRequest request) {
        return ResponseEntity.ok(tareaOperativaService.subirEvidencia(id, request.getUrl(), request.getObs()));
    }

    @GetMapping("/all")
    public List<TareaOperativa> listarTodo() {
        return tareaOperativaService.findAll();
    }
}
