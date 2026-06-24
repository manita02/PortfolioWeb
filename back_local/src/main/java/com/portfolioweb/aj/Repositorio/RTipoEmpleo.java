package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.TipoEmpleo;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RTipoEmpleo extends JpaRepository<TipoEmpleo, Long> {

    Optional<TipoEmpleo> findByNombre(String nombre);

    boolean existsByNombre(String nombre);
}
