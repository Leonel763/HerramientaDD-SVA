package com.mgks.peru.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "sucursales")
public class Sucursal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreSucursal;

    @Column(nullable = false)
    private String direccion;

    
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties("sucursales")
    private Cliente cliente;

    // --- Getters y Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreSucursal() {
        return nombreSucursal;
    }

    public void setNombreSucursal(String nombreSucursal) {
        this.nombreSucursal = nombreSucursal;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
