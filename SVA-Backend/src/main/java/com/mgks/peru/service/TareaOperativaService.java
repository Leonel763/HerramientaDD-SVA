package com.mgks.peru.service;

import com.mgks.peru.model.Sucursal;
import com.mgks.peru.model.TareaOperativa;
import com.mgks.peru.repository.TareaOperativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
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
    public TareaOperativa subirEvidencia(Long id, String urlEvidencia, String observaciones, Double gpsLat, Double gpsLng, Double gpsAccuracy) {
        TareaOperativa t = tareaOperativaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + id));

        t.setUrlEvidencia(urlEvidencia);
        t.setObservaciones(observaciones);
        t.setGpsLat(gpsLat);
        t.setGpsLng(gpsLng);
        t.setGpsAccuracy(gpsAccuracy);

        Sucursal sucursal = t.getSucursal();
        if (gpsLat != null && gpsLng != null && sucursal.getLatitud() != null && sucursal.getLongitud() != null
                && sucursal.getRadioPermitido() != null) {
            double distancia = calcularDistancia(
                gpsLat, gpsLng, sucursal.getLatitud(), sucursal.getLongitud());
            if (distancia > sucursal.getRadioPermitido()) {
                throw new IllegalArgumentException(String.format(
                    "Ubicación fuera del radio permitido (%.0f m). Distancia: %.0f m.",
                    sucursal.getRadioPermitido(), distancia));
            }
        }

        LocalTime ahora = LocalTime.now();
        t.setHoraAsistencia(ahora);

        if (t.getHoraInicio() != null && t.getToleranciaMinutos() != null) {
            long diffMinutos = Math.abs(Duration.between(t.getHoraInicio(), ahora).toMinutes());
            t.setAsistencia(diffMinutos <= t.getToleranciaMinutos() ? "A" : "T");
        }

        t.setEstado("EN_REVISION");
        return tareaOperativaRepository.save(t);
    }

    private double calcularDistancia(double lat1, double lng1, double lat2, double lng2) {
        final double RADIO_TIERRA = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return RADIO_TIERRA * c;
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
