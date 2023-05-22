
package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoProyecto;
import com.portfolioweb.aj.Entidad.Proyecto;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SProyecto;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("proyecto")
@CrossOrigin(origins = "http://localhost:4200")
public class CProyecto {
    @Autowired
    SProyecto sProyecto; 
    
    @GetMapping("/lista")
    public ResponseEntity<List<Proyecto>> list(){
        List<Proyecto> list = sProyecto.list(); 
        return new ResponseEntity(list,HttpStatus.OK); 
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<Proyecto> getById(@PathVariable("id") int id){
        if(!sProyecto.existsById(id))
            return new ResponseEntity(new Mensaje("no existe"), HttpStatus.NOT_FOUND);
        Proyecto proyecto = sProyecto.getOne(id).get();
        return new ResponseEntity(proyecto, HttpStatus.OK);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id){
        //validacion si existe el ID
        if(!sProyecto.existsById(id))
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        sProyecto.delete(id);
        
        return new ResponseEntity(new Mensaje("Proyecto eliminado"), HttpStatus.OK); 
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoProyecto dtoproyecto){
        if(StringUtils.isBlank(dtoproyecto.getNombreE()))
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"),HttpStatus.BAD_REQUEST); 
        
        if(StringUtils.isBlank(dtoproyecto.getDescripcionE()))
            return new ResponseEntity(new Mensaje("La descripcion es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoproyecto.getImg()))
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoproyecto.getLink()))
            return new ResponseEntity(new Mensaje("La URL es obligatoria"),HttpStatus.BAD_REQUEST);
       
        if(sProyecto.existsByNombreE(dtoproyecto.getNombreE()))
            return new ResponseEntity(new Mensaje("Ese proyecto ya existe"),HttpStatus.BAD_REQUEST); 
    
        Proyecto proyecto = new Proyecto(dtoproyecto.getNombreE(), dtoproyecto.getDescripcionE(), dtoproyecto.getLink(), dtoproyecto.getImg(), dtoproyecto.getAnocomienzo()); 
        sProyecto.save(proyecto);
        
        return new ResponseEntity(new Mensaje ("Proyecto agregado"), HttpStatus.OK); 
    
    }
    
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoProyecto dtoproyecto){
        
        //validacion si existe el ID
        if(!sProyecto.existsById(id))
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST); 
        
        
        //comparacion del nombre experiencia
        if(sProyecto.existsByNombreE(dtoproyecto.getNombreE()) && sProyecto.getByNombreE(dtoproyecto.getNombreE()).get().getId() != id ){
            return new ResponseEntity(new Mensaje("Ese proyecto ya existe"), HttpStatus.BAD_REQUEST);
        }
        
        //el campo no puede estar vacio
        if(StringUtils.isBlank(dtoproyecto.getNombreE()))
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"), HttpStatus.BAD_REQUEST); 
        
        if(StringUtils.isBlank(dtoproyecto.getDescripcionE()))
            return new ResponseEntity(new Mensaje("La descripcion es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoproyecto.getImg()))
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoproyecto.getLink()))
            return new ResponseEntity(new Mensaje("La URL es obligatoria"),HttpStatus.BAD_REQUEST);
    
        Proyecto proyecto = sProyecto.getOne(id).get();
        proyecto.setNombreE(dtoproyecto.getNombreE());
        proyecto.setDescripcionE(dtoproyecto.getDescripcionE());
        proyecto.setLink(dtoproyecto.getLink());
        proyecto.setImg(dtoproyecto.getImg());
        proyecto.setAnocomienzo(dtoproyecto.getAnocomienzo());
        sProyecto.save(proyecto); 
        return new ResponseEntity(new Mensaje("Proyecto actualizado"), HttpStatus.OK);      
    
    }
}
