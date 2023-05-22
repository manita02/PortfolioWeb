
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.Proyecto;
import com.portfolioweb.aj.Repositorio.RProyecto;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class SProyecto {
    @Autowired
    RProyecto rProyecto; 
    
    public List<Proyecto> list(){
        return rProyecto.findAll(); 
    }
    
    public Optional<Proyecto> getOne(int id){
        return rProyecto.findById(id); 
    }
    
    public Optional<Proyecto> getByNombreE(String nombreE){
        return rProyecto.findByNombreE(nombreE); 
    }
    
    public void save(Proyecto proyecto){
        rProyecto.save(proyecto); 
    }
    
    public void delete(int id){
        rProyecto.deleteById(id);
    }
    
    public boolean existsById(int id){
        return rProyecto.existsById(id); 
    }
    
    public boolean existsByNombreE(String nombreE){
        return rProyecto.existsByNombreE(nombreE); 
    }
}
