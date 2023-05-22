
package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoHabilidades;
import com.portfolioweb.aj.Entidad.Habilidades;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SHabilidades;
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
@RequestMapping("/habilidades")
@CrossOrigin(origins = "http://localhost:4200")
public class CHabilidades {
    @Autowired
    SHabilidades sHabilidades;
    
    @GetMapping("/lista")
    public ResponseEntity<List<Habilidades>> list(){
        List<Habilidades> list = sHabilidades.list(); 
        return new ResponseEntity(list, HttpStatus.OK); 
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<Habilidades> getById(@PathVariable("id")int id){
        if(!sHabilidades.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        Habilidades habilidades = sHabilidades.getOne(id).get(); 
        return new ResponseEntity(habilidades, HttpStatus.OK);
    }
    
    
   @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id){
       if(!sHabilidades.existsById(id)){
           return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND); 
       }
       sHabilidades.delete(id);
       return new ResponseEntity(new Mensaje("Habilidad eliminada"), HttpStatus.OK); 
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoHabilidades dtohabilidades){
        if(StringUtils.isBlank(dtohabilidades.getNombreH())){
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtohabilidades.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        
        
        
        if(sHabilidades.existsByNombreE(dtohabilidades.getNombreH())){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
  
        Habilidades habilidades = new Habilidades(dtohabilidades.getNombreH(), dtohabilidades.getPorcentaje(), dtohabilidades.getImg());
        sHabilidades.save(habilidades);
        return new ResponseEntity(new Mensaje ("Habilidad creada"), HttpStatus.OK); 
    
    }
    
    @PutMapping("/update/{id}") 
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoHabilidades dtohabilidades){       
        if(!sHabilidades.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        
        if(sHabilidades.existsByNombreE(dtohabilidades.getNombreH()) && sHabilidades.getByNombreE(dtohabilidades.getNombreH()).get().getId() != id){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
        
        
         
       
        if(StringUtils.isBlank(dtohabilidades.getNombreH())){
            return new ResponseEntity(new Mensaje("El campo no puede estar vacío"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtohabilidades.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        Habilidades habilidades = sHabilidades.getOne(id).get(); 
        
        habilidades.setNombreH(dtohabilidades.getNombreH());
        habilidades.setPorcentaje(dtohabilidades.getPorcentaje());
        habilidades.setImg(dtohabilidades.getImg());
        
        sHabilidades.save(habilidades);
        
        return new ResponseEntity(new Mensaje("Habilidad actualizada"), HttpStatus.OK); 
    }
}
