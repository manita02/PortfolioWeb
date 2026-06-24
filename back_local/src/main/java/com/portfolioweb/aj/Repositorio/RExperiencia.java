package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Experiencia;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RExperiencia extends JpaRepository<Experiencia, Integer> {

    Optional<Experiencia> findByNombreE(String nombreE);

    boolean existsByNombreE(String nombreE);

    List<Experiencia> findByEsActualTrue();

    List<Experiencia> findByOrganizacionId(Long organizacionId);

    @Query("SELECT DISTINCT e FROM Experiencia e "
            + "LEFT JOIN FETCH e.tipoEmpleo "
            + "LEFT JOIN FETCH e.tipoUbicacion "
            + "LEFT JOIN FETCH e.organizacion "
            + "LEFT JOIN FETCH e.habilidades")
    List<Experiencia> findAllWithRelations();

    @Query("SELECT e FROM Experiencia e "
            + "LEFT JOIN FETCH e.tipoEmpleo "
            + "LEFT JOIN FETCH e.tipoUbicacion "
            + "LEFT JOIN FETCH e.organizacion "
            + "LEFT JOIN FETCH e.habilidades "
            + "WHERE e.id = :id")
    Optional<Experiencia> findByIdWithRelations(@Param("id") int id);
}
