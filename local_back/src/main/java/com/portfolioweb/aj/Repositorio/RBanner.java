
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Banner;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RBanner extends JpaRepository<Banner, Integer> {
    public Optional<Banner> findByTitulo(String titulo); 
    public boolean existsByTitulo(String titulo); 
}
