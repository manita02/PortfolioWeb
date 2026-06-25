package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Proyecto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RProyecto extends JpaRepository<Proyecto, Integer> {

    Optional<Proyecto> findByNombreE(String nombreE);

    boolean existsByNombreE(String nombreE);

    List<Proyecto> findByEsActualTrue();

    @Query("SELECT DISTINCT p FROM Proyecto p "
            + "LEFT JOIN FETCH p.organizacion "
            + "LEFT JOIN FETCH p.habilidades")
    List<Proyecto> findAllWithRelations();

    @Query("SELECT p FROM Proyecto p "
            + "LEFT JOIN FETCH p.organizacion "
            + "LEFT JOIN FETCH p.habilidades "
            + "WHERE p.id = :id")
    Optional<Proyecto> findByIdWithRelations(@Param("id") int id);
}
