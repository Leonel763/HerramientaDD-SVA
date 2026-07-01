package com.mgks.peru.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(length = 8)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(length = 9)
    private String telefono;

    @Column(name = "sueldo_base", nullable = false)
    private Double sueldoBase;

    @Column(nullable = false, length = 30)
    private String rol = "TRABAJADOR";

    @Column(length = 50)
    private String banco;

    @Column(name = "numero_cuenta", length = 30)
    private String numeroCuenta; 

    @Column(nullable = false, length = 255) 
    private String password;

    public Usuario() {
    }

    public Usuario(String dni, String nombre, String apellidos, String telefono, Double sueldoBase, String rol, String banco, String numeroCuenta, String password) {
        this.dni = dni;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.sueldoBase = sueldoBase;
        this.rol = rol;
        this.banco = banco;
        this.numeroCuenta = numeroCuenta;
        this.password = password;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Double getSueldoBase() {
        return sueldoBase;
    }

    public void setSueldoBase(Double sueldoBase) {
        this.sueldoBase = sueldoBase;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getBanco() {
        return banco;
    }

    public void setBanco(String banco) {
        this.banco = banco;
    }

    public String getNumeroCuenta() {
        return numeroCuenta;
    }

    public void setNumeroCuenta(String numeroCuenta) {
        this.numeroCuenta = numeroCuenta;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}