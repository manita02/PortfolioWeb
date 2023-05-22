
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Habilidades;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RHabilidades extends JpaRepository<Habilidades, Integer>{
    public Optional<Habilidades> findByNombreH(String nombreH); 
    public boolean existsByNombreH(String nombreH); 
}
