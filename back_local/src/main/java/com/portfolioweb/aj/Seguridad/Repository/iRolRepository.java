
package com.portfolioweb.aj.Seguridad.Repository;

import com.portfolioweb.aj.Seguridad.Entity.Rol;
import com.portfolioweb.aj.Seguridad.Enums.RolNombre;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface iRolRepository extends JpaRepository<Rol, Integer>{
    Optional<Rol> findByRolNombre(RolNombre rolNombre); 
}
