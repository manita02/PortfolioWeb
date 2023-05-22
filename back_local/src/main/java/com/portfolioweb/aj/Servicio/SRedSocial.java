
 
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.RedSocial;
import com.portfolioweb.aj.Repositorio.RSocialNetworks;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class SRedSocial {
    @Autowired
    RSocialNetworks rSocialNetworks; 
    
    public List<RedSocial> list(){
        return rSocialNetworks.findAll(); 
    }
    
    public Optional<RedSocial> getOne(int id){
        return rSocialNetworks.findById(id); 
    }
    
    public Optional<RedSocial> getByNombreRedS(String nombreRedS){
        return rSocialNetworks.findBynombreRedS(nombreRedS); 
    }
    
    public void save(RedSocial redsocial){
        rSocialNetworks.save(redsocial); 
    }
    
    public void delete(int id){
        rSocialNetworks.deleteById(id);
    }
    
    public boolean existsById(int id){
        return rSocialNetworks.existsById(id); 
    }
    
    public boolean existsByNombreRedS(String nombreRedS){
        return rSocialNetworks.existsBynombreRedS(nombreRedS); 
    }
    
    
}
