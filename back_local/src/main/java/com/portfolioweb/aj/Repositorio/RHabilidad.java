package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Habilidad;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RHabilidad extends JpaRepository<Habilidad, Long> {

    Optional<Habilidad> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
