
package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoPersona;
import com.portfolioweb.aj.Entidad.Persona;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.ImpPersonaServicio;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/persona")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonaControlador {
    @Autowired 
    ImpPersonaServicio ipersonaservice; 
    
    @GetMapping("/lista")
    public ResponseEntity<List<Persona>> list(){
        List<Persona> list = ipersonaservice.list(); 
        return new ResponseEntity(list, HttpStatus.OK); 
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<Persona> getById(@PathVariable("id")int id){
        if(!ipersonaservice.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        Persona persona = ipersonaservice.getOne(id).get(); 
        return new ResponseEntity(persona, HttpStatus.OK);
    }
    
   @PreAuthorize("hasRole('ADMIN')")
   @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id){
       if(!ipersonaservice.existsById(id)){
           return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND); 
       }
       ipersonaservice.delete(id);
       return new ResponseEntity(new Mensaje("Persona eliminada"), HttpStatus.OK); 
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoPersona dtopersona){
        if(StringUtils.isBlank(dtopersona.getNombre())){
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getApellido())){
            return new ResponseEntity(new Mensaje("El apellido es obligatorio"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getAcercaDe())){
            return new ResponseEntity(new Mensaje("La informacion personal es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getProfesion())){
            return new ResponseEntity(new Mensaje("La profesión es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        
        
        
        
        if(ipersonaservice.existsByNombre(dtopersona.getNombre())){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
     
        
        
        Persona persona = new Persona(dtopersona.getNombre(), dtopersona.getApellido(), dtopersona.getImg(), dtopersona.getProfesion(), dtopersona.getAcercaDe());
        ipersonaservice.save(persona);
        return new ResponseEntity(new Mensaje ("Persona creada"), HttpStatus.OK); 
    
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}") 
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoPersona dtopersona){       
        if(!ipersonaservice.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        
        if(ipersonaservice.existsByNombre(dtopersona.getNombre()) && ipersonaservice.getByNombre(dtopersona.getNombre()).get().getId() != id){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
       
        
        if(StringUtils.isBlank(dtopersona.getNombre())){
            return new ResponseEntity(new Mensaje("El campo no puede estar vacío"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getApellido())){
            return new ResponseEntity(new Mensaje("El apellido es obligatorio"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getAcercaDe())){
            return new ResponseEntity(new Mensaje("La informacion personal es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getProfesion())){
            return new ResponseEntity(new Mensaje("La profesión es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtopersona.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        
        Persona persona = ipersonaservice.getOne(id).get(); 
        
        persona.setNombre(dtopersona.getNombre());
        persona.setApellido(dtopersona.getApellido());
        persona.setImg(dtopersona.getImg());
        persona.setProfesion(dtopersona.getProfesion());
        persona.setAcercaDe(dtopersona.getAcercaDe());
        
        ipersonaservice.save(persona);
        
        return new ResponseEntity(new Mensaje("Persona actualizada"), HttpStatus.OK); 
    }
    
    
}


