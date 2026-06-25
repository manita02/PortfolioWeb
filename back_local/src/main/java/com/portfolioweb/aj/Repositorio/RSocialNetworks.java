
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.RedSocial;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RSocialNetworks extends JpaRepository<RedSocial, Integer>{
    Optional<RedSocial> findBynombreRedS(String nombreRedS);
    boolean existsBynombreRedS(String nombreRedS);

    List<RedSocial> findAllByOrderByIdDesc();
}
