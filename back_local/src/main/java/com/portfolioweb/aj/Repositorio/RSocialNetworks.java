
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.RedSocial;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RSocialNetworks extends JpaRepository<RedSocial, Integer>{
    public Optional<RedSocial> findBynombreRedS(String nombreRedS); 
    public boolean existsBynombreRedS(String nombreRedS); 
 
}
