package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.TipoUbicacion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RTipoUbicacion extends JpaRepository<TipoUbicacion, Integer> {

    Optional<TipoUbicacion> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
