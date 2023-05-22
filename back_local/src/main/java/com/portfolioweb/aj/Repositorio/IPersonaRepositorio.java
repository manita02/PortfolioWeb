
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Persona;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IPersonaRepositorio extends JpaRepository<Persona, Integer>{
    public Optional<Persona> findBynombre(String nombre); 
    public boolean existsBynombre(String nombre);

    
}
