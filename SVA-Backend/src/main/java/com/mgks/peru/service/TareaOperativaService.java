package com.mgks.peru.service;

import com.mgks.peru.model.TareaOperativa;
import com.mgks.peru.repository.TareaOperativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class TareaOperativaService {

    @Autowired
    private TareaOperativaRepository tareaOperativaRepository;

    public TareaOperativa asignarTarea(TareaOperativa tarea) {

        if (tarea.getUsuario() == null || tarea.getUsuario().getDni() == null || tarea.getUsuario().getDni().trim().isEmpty()) {
            throw new IllegalArgumentException("No se puede asignar una tarea sin un operario válido (DNI requerido).");
        }
        if (tarea.getSucursal() == null || tarea.getSucursal().getId() == null) {
            throw new IllegalArgumentException("No se puede asignar una tarea sin una Sucursal/Sede operativa válida.");
        }

        tarea.setEstado("PENDIENTE");
        tarea.setUrlEvidencia(null);
        return tareaOperativaRepository.save(tarea);
    }

    public List<TareaOperativa> listarPorTrabajador(String dni) {
        return tareaOperativaRepository.findByUsuarioDni(dni);
    }

    public List<TareaOperativa> listarPorFecha(LocalDate fecha) {
        return tareaOperativaRepository.findByFecha(fecha);
    }

    public List<TareaOperativa> listarPorFechaYEstado(LocalDate fecha, String estado) {
        return tareaOperativaRepository.findByFechaAndEstado(fecha, estado);
    }

    @Transactional
    public TareaOperativa subirEvidencia(Long id, String urlEvidencia, String observaciones) {
        TareaOperativa t = tareaOperativaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + id));

        t.setUrlEvidencia(urlEvidencia);
        t.setObservaciones(observaciones);
        t.setEstado("EN_REVISION");
        return tareaOperativaRepository.save(t);
    }

    @Transactional
    public TareaOperativa resolverTarea(Long id, String nuevoEstado) {
        TareaOperativa t = tareaOperativaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + id));

        List<String> estadosValidos = Arrays.asList("APROBADO", "RECHAZADO", "FALTA");
        if (!estadosValidos.contains(nuevoEstado)) {
            throw new IllegalArgumentException("Estado de resolución no válido: " + nuevoEstado);
        }

        t.setEstado(nuevoEstado);
        return tareaOperativaRepository.save(t);
    }

    public List<TareaOperativa> findAll() {
        return tareaOperativaRepository.findAll();
    }
}
