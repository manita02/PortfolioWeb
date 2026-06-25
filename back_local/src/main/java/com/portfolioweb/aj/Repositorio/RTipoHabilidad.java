package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.TipoHabilidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RTipoHabilidad extends JpaRepository<TipoHabilidad, Integer> {
}
