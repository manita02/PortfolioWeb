package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Educacion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface REduacion extends JpaRepository<Educacion, Integer> {

    Optional<Educacion> findByNombreE(String nombreE);

    boolean existsByNombreE(String nombreE);

    @Query("SELECT DISTINCT e FROM Educacion e "
            + "LEFT JOIN FETCH e.tipoEducacion "
            + "LEFT JOIN FETCH e.organizacion "
            + "LEFT JOIN FETCH e.habilidades h "
            + "LEFT JOIN FETCH h.tipoHabilidad")
    List<Educacion> findAllWithRelations();

    @Query("SELECT e FROM Educacion e "
            + "LEFT JOIN FETCH e.tipoEducacion "
            + "LEFT JOIN FETCH e.organizacion "
            + "LEFT JOIN FETCH e.habilidades h "
            + "LEFT JOIN FETCH h.tipoHabilidad "
            + "WHERE e.id = :id")
    Optional<Educacion> findByIdWithRelations(@Param("id") int id);
}
