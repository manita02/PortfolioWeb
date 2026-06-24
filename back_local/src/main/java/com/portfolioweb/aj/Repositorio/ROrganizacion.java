package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Organizacion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ROrganizacion extends JpaRepository<Organizacion, Long> {

    Optional<Organizacion> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
