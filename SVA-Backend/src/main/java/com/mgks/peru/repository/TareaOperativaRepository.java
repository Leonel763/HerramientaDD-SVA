package com.mgks.peru.repository;

import com.mgks.peru.model.TareaOperativa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TareaOperativaRepository extends JpaRepository<TareaOperativa, Long> {

    @Query("SELECT t FROM TareaOperativa t WHERE t.usuario.dni = :dni")
    List<TareaOperativa> findByUsuarioDni(@Param("dni") String dni);

    @Modifying
    @Query("DELETE FROM TareaOperativa t WHERE t.usuario.dni = :dni")
    void deleteByUsuarioDni(@Param("dni") String dni);

    List<TareaOperativa> findByFecha(LocalDate fecha);

    List<TareaOperativa> findByFechaAndEstado(LocalDate fecha, String estado);

    List<TareaOperativa> findByFechaAndSucursalId(LocalDate fecha, Long sucursalId);
}