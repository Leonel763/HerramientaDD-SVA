package com.mgks.peru.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "tareas_operativas", indexes = {
    @Index(name = "idx_fecha_estado", columnList = "fecha, estado")
})
public class TareaOperativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private String turno;

    @Column(nullable = false)
    private String horasAsignadas;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaInicio;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaFin;

    private Integer toleranciaMinutos;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPuesto tipoPuesto;

    @Column(nullable = false)
    private String estado; 

    @Column(columnDefinition = "LONGTEXT")
    private String urlEvidencia; 

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    private Double gpsLat;

    private Double gpsLng;

    private Double gpsAccuracy;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime horaAsistencia;

    private String asistencia;

    @ManyToOne
    @JoinColumn(name = "usuario_dni", referencedColumnName = "dni", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "sucursal_id", referencedColumnName = "id", nullable = false)
    private Sucursal sucursal;

    public TareaOperativa() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getHorasAsignadas() {
        return horasAsignadas;
    }

    public void setHorasAsignadas(String horasAsignadas) {
        this.horasAsignadas = horasAsignadas;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public Integer getToleranciaMinutos() {
        return toleranciaMinutos;
    }

    public void setToleranciaMinutos(Integer toleranciaMinutos) {
        this.toleranciaMinutos = toleranciaMinutos;
    }

    public TipoPuesto getTipoPuesto() {
        return tipoPuesto;
    }

    public void setTipoPuesto(TipoPuesto tipoPuesto) {
        this.tipoPuesto = tipoPuesto;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getUrlEvidencia() {
        return urlEvidencia;
    }

    public void setUrlEvidencia(String urlEvidencia) {
        this.urlEvidencia = urlEvidencia;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }

    public Double getGpsLat() {
        return gpsLat;
    }

    public void setGpsLat(Double gpsLat) {
        this.gpsLat = gpsLat;
    }

    public Double getGpsLng() {
        return gpsLng;
    }

    public void setGpsLng(Double gpsLng) {
        this.gpsLng = gpsLng;
    }

    public Double getGpsAccuracy() {
        return gpsAccuracy;
    }

    public void setGpsAccuracy(Double gpsAccuracy) {
        this.gpsAccuracy = gpsAccuracy;
    }

    public LocalTime getHoraAsistencia() {
        return horaAsistencia;
    }

    public void setHoraAsistencia(LocalTime horaAsistencia) {
        this.horaAsistencia = horaAsistencia;
    }

    public String getAsistencia() {
        return asistencia;
    }

    public void setAsistencia(String asistencia) {
        this.asistencia = asistencia;
    }
}