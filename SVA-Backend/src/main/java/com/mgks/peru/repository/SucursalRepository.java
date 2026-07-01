package com.mgks.peru.repository;

import com.mgks.peru.model.Sucursal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SucursalRepository extends JpaRepository<Sucursal, Long> {
    
    
    @Query("SELECT s FROM Sucursal s WHERE s.cliente.id = :clienteId")
    List<Sucursal> findByClienteId(@Param("clienteId") Long clienteId);
}