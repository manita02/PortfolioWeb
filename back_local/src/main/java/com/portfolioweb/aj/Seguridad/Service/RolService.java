
package com.portfolioweb.aj.Seguridad.Service;

import com.portfolioweb.aj.Seguridad.Entity.Rol;
import com.portfolioweb.aj.Seguridad.Enums.RolNombre;
import com.portfolioweb.aj.Seguridad.Repository.iRolRepository;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RolService {

    @Autowired
    iRolRepository irolRepository;

    public Optional<Rol> getByRolNombre(RolNombre rolNombre) {
        return irolRepository.findByRolNombre(rolNombre);
    }

    public void save(Rol rol) {
        irolRepository.save(rol);
    }

    
   
}
