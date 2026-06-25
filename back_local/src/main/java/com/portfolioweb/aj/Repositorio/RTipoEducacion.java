package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.TipoEducacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RTipoEducacion extends JpaRepository<TipoEducacion, Long> {
}
