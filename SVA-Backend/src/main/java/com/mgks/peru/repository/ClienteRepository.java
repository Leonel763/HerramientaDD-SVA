package com.mgks.peru.repository;

import com.mgks.peru.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Optional<Cliente> findByRuc(String ruc);
}